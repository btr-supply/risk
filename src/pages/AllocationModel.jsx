import React from 'react';
import { Box, Typography, Grid, IconButton, List, ListItem, ListItemText, TextField, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import RestoreIcon from '@mui/icons-material/Restore';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import { useRiskModel } from '../state';
import {
  BPS,
  calculateCScore,
  componentMaxWeightBp,
  targetWeights,
  targetAllocations,
  validation,
  generateMaxWeightCurveData,
  bpToPercent,
  defaultWeightModel,
} from '../models';
import {
  Section,
  ParameterCard,
  DescriptionCard,
  ParameterSlider,
  SimulationCard,
  ChartContainer,
  formatBp,
  formatCurrency,
  ParameterTextField,
  FormulaLegend,
  SimulationResult,
} from '../components/index.jsx';

export const AllocationModel = () => {
  const theme = useTheme();
  const {
    weightModel,
    simulation,
    updateWeightModel,
    updateCScores,
    updateMaxWeightPoolCount,
    updateVaultTvl,
    addPool,
    removePool,
    updatePoolScore,
  } = useRiskModel();

  // Section 1: Allocation Model Configuration
  const allocationModelParams = (
    <ParameterCard
      title="Parameters"
      action={
        <Button
          size="small"
          startIcon={<RestoreIcon />}
          onClick={() => updateWeightModel(defaultWeightModel)}
          sx={{ textTransform: 'none' }}
        >
          Reset
        </Button>
      }
    >
      <ParameterSlider
        label="Default C-Score"
        value={weightModel.defaultCScore}
        onChange={(value) => updateWeightModel({ defaultCScore: value })}
        min={validation.weightModel.defaultCScore.min}
        max={validation.weightModel.defaultCScore.max}
        step={100}
        formatValue={(v) => formatBp(v, 0)}
        helperText="Default pool C-Score (0-100%)"
      />
      <ParameterSlider
        label="Score Amplifier"
        value={weightModel.scoreAmplifierBp}
        onChange={(value) => updateWeightModel({ scoreAmplifierBp: value })}
        min={validation.weightModel.scoreAmplifierBp.min}
        max={validation.weightModel.scoreAmplifierBp.max}
        step={100}
        formatValue={(v) => `${(v / BPS).toFixed(2)}x`}
        helperText="Score exponentiation factor (0.75x-2.5x)"
      />
      <ParameterSlider
        label="Min Max Weight"
        value={weightModel.minMaxBp}
        onChange={(value) => updateWeightModel({ minMaxBp: Math.min(value, weightModel.maxBp) })}
        min={validation.weightModel.minMaxBp.min}
        max={weightModel.maxBp} // Dynamic max based on maxBp
        step={100}
        formatValue={(v) => formatBp(v,0)}
        helperText="Minimum maximum dynamic weight (0-100%)"
      />
      <ParameterSlider
        label="Absolute Max Weight"
        value={weightModel.maxBp}
        onChange={(value) => {
          updateWeightModel({ maxBp: value });
          if (weightModel.minMaxBp > value) {
            updateWeightModel({ minMaxBp: value });
          }
        }}
        min={validation.weightModel.maxBp.min}
        max={validation.weightModel.maxBp.max}
        step={100}
        formatValue={(v) => formatBp(v,0)}
        helperText="Absolute maximum weight per pool (10-100%)"
      />
      <ParameterSlider
        label="Diversification Factor"
        value={weightModel.diversificationFactorBp}
        onChange={(value) => updateWeightModel({ diversificationFactorBp: value })}
        min={validation.weightModel.diversificationFactorBp.min}
        max={validation.weightModel.diversificationFactorBp.max}
        step={100}
        formatValue={(v) => `${(v / BPS).toFixed(2)}`}
        helperText="Exponential decay for max weight (0.05-2.0)"
      />
    </ParameterCard>
  );

  const allocationModelDescription = (
    <DescriptionCard
      title="Methodology"
      formula={String.raw`a_i = \frac{w_i \cdot T}{10000} \quad \text{where} \quad w_i = \frac{c_i^p}{\sum_{j} c_j^p} \cdot 10000`}
    >
      <Typography variant="body2" paragraph>
        <strong>Theoretical foundation</strong>: BTR implements a <strong>quantitative vault optimization framework</strong> combining modern portfolio theory principles: <strong>Kelly Criterion</strong> for logarithmic utility maximization, <strong>Black-Litterman model</strong> Bayesian approach for view integration, and <strong>Risk Parity</strong> methodologies for balanced risk contribution across allocated pools.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Core methodology</strong>: The model integrates <strong>geometric mean composite scoring</strong> (multiplicative risk assessment), <strong>power utility functions</strong> for varying risk preferences, and <strong>dynamic diversification constraints</strong> with exponential decay. This creates strategy-proof allocation mechanisms that prevent gaming while optimizing long-term growth rates under uncertainty.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Practical advantages</strong>: Conservative amplification (0.75-1.0x) creates flat, diversified distributions ideal for risk-averse strategies. Aggressive amplification (2.0-2.5x) concentrates allocations in top-performing pools for alpha-seeking approaches. The iterative capping algorithm prevents over-concentration while maintaining optimal capital deployment efficiency.
      </Typography>
      <Typography variant="body2">
        <strong>Mathematical implementation</strong>: Four-stage process: 1) Composite scoring via geometric mean, 2) Exponential amplification using power functions, 3) Normalization to 100% weight distribution, 4) Dynamic capping with iterative redistribution. See <a href="#vault-allocation-section" style={{color: theme.colors.functional.link, textDecoration: 'underline'}}>Target Allocation below</a> for interactive examples.
      </Typography>
      <FormulaLegend items={[
        { symbol: '<em>T</em>', text: 'total vault TVL' },
        { symbol: '<em>a<sub>i</sub></em>', text: 'pool allocation <em>i</em>' },
        { symbol: '<em>w<sub>i</sub></em>', text: 'pool weight <em>i</em> (BP)' },
        { symbol: '<em>c<sub>i</sub></em>', text: 'pool c-score <em>i</em> (BP)' },
        { symbol: '<em>p</em>', text: 'score amplification factor' },
      ]} />
    </DescriptionCard>
  );

  // Section 2: Geometric C-Score Simulation
  const { trust, liquidity, performance: perfScore } = simulation.cScores;
  const individualScores = [trust, liquidity, perfScore];
  const finalCScore = calculateCScore(individualScores);

  const cScoreParams = (
    <DescriptionCard
      title="Methodology"
      formula={String.raw`c = \sqrt[3]{t \cdot l \cdot p} = (t \cdot l \cdot p)^{1/3}`}
    >
      <Typography variant="body2" paragraph>
        <strong>Theoretical foundation</strong>: The C-Score implements <strong>geometric mean optimization theory</strong> from Kelly Criterion principles, maximizing long-term growth rates under uncertainty. This approach ensures <strong>multiplicative risk assessment</strong> where risks compound rather than add linearly, consistent with modern financial theory and logarithmic utility maximization.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Core methodology</strong>: Each pool receives <strong>Trust</strong> (audits, team reputation, protocol track record), <strong>Liquidity</strong> (TVL depth, trading volume), and <strong>Performance</strong> (fee efficiency, IL profile) scores. The geometric mean composition creates <strong>balanced risk contribution</strong> requirements and zero-sensitivity property for comprehensive quality assessment.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Practical advantages</strong>: Any dimension scoring zero eliminates pool allocation (c-score = 0), preventing investment in unbalanced opportunities. Strong performance in one area cannot compensate for complete failure in another, implementing <strong>minimum competency thresholds</strong> across all risk dimensions while rewarding balanced excellence.
      </Typography>
      <Typography variant="body2">
        <strong>Mathematical implementation</strong>: Three-dimensional geometric mean calculation ensures equal weighting of Trust, Liquidity, and Performance factors. Adjust sliders above to see how individual scores combine into final composite scores that drive <a href="#vault-allocation-section" style={{color: theme.colors.functional.link, textDecoration: 'underline'}}>allocation weights below</a>.
      </Typography>
      <FormulaLegend items={[
        { symbol: '<em>c</em>', text: 'composite score (BP)' },
        { symbol: '<em>t</em>', text: 'trust score (BP)' },
        { symbol: '<em>l</em>', text: 'liquidity score (BP)' },
        { symbol: '<em>p</em>', text: 'performance score (BP)' },
      ]} />
    </DescriptionCard>
  );

  const cScoreChart = (
    <SimulationCard
      title="Simulation"
      action={
        <Button
          size="small"
          startIcon={<RestoreIcon />}
          onClick={() => updateCScores({ trust: 7500, liquidity: 7500, performance: 7500 })}
          sx={{ textTransform: 'none' }}
        >
          Reset
        </Button>
      }
      controls={
        <Box>
          <ParameterSlider
            label="Trust Score"
            value={trust}
            onChange={(v) => updateCScores({ trust: v })}
            min={0} max={BPS} step={100}
            formatValue={formatBp}
            helperText="Audits, team reputation and activity, protocol track record"
          />
          <ParameterSlider
            label="Liquidity Score"
            value={liquidity}
            onChange={(v) => updateCScores({ liquidity: v })}
            min={0} max={BPS} step={100}
            formatValue={formatBp}
            helperText="TVL (pool depth), trading volume"
          />
          <ParameterSlider
            label="Performance Score"
            value={perfScore}
            onChange={(v) => updateCScores({ performance: v })}
            min={0} max={BPS} step={100}
            formatValue={formatBp}
            helperText="Fees/TVL, incentives/TVL"
          />

          {/* Read-only C-Score Display */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.125rem', color: 'text.primary', mb: 0.5 }}>
              C-Score
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.95rem', display: 'block', mb: 1 }}>
              Composite geometric mean of the above scores
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ flex: 1, pr: 1 }}>
                <Box sx={{
                  height: 4,
                  backgroundColor: '#21262d',
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    height: '100%',
                    width: `${bpToPercent(finalCScore)}%`,
                    backgroundColor: theme.colors.chart[1], // Green highlight
                    borderRadius: 2,
                    transition: 'width 0.3s ease'
                  }} />
                </Box>
              </Box>
              <Box sx={{ minWidth: '85px', flexShrink: 0, display: 'flex', alignItems: 'center', height: '32px' }}>
                <Chip
                  label={formatBp(finalCScore)}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    width: '100%',
                    height: '24px',
                    borderColor: theme.colors.chart[1],
                    color: theme.colors.chart[1],
                    backgroundColor: `${theme.colors.chart[1]}15`
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      }
    >
      <ChartContainer>
        <Box sx={{ display: 'flex', gap: 2, width: '100%', height: '100%' }}>
          {/* Main Scores Chart */}
          <Box sx={{ flex: '2 1 70%', height: '100%' }}>
            <BarChart
              series={[
                {
                  data: [
                    bpToPercent(trust),
                    bpToPercent(liquidity),
                    bpToPercent(perfScore)
                  ],
                }
              ]}
              colors={[
                theme.colors.chart[0], // Trust - Apple blue
                theme.colors.chart[1], // Liquidity - Apple green
                theme.colors.chart[2], // Performance - Apple orange
              ]}
              xAxis={[{
                data: ['Trust', 'Liquidity', 'Performance'],
                scaleType: 'band',
              }]}
              yAxis={[{ min: 0, max: 100 }]}
              margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
              height={440}
              slotProps={{
                legend: { hidden: true }
              }}
            />
          </Box>

          {/* C-Score Chart */}
          <Box sx={{ flex: '1 1 30%', height: '100%' }}>
            <BarChart
              series={[
                {
                  data: [bpToPercent(finalCScore)],
                  color: theme.colors.chart[1], // Green color
                }
              ]}
              xAxis={[{
                data: ['C-Score'],
                scaleType: 'band',
              }]}
              yAxis={[{ min: 0, max: 100, display: false }]}
              margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
              height={440}
              slotProps={{
                legend: { hidden: true }
              }}
            />
          </Box>
        </Box>
      </ChartContainer>
    </SimulationCard>
  );

  // Section 3: Max Weight Simulation
  const maxWeightData = generateMaxWeightCurveData(weightModel, 20);
  const currentMaxWeightForPoolCount = componentMaxWeightBp(
    simulation.maxWeightPoolCount,
    weightModel.minMaxBp,
    weightModel.diversificationFactorBp,
    weightModel.maxBp
  );

  const maxWeightDescription = (
    <DescriptionCard
      title="Methodology"
      formula={String.raw`w_m = w_0 + e^{-n \cdot d} \quad \text{where} \quad w_e = \min(w_m, w_a)`}
    >
      <Typography variant="body2" paragraph>
        <strong>Theoretical foundation</strong>: The exponential decay function implements <strong>diminishing marginal utility theory</strong> from portfolio optimization and <strong>factor-based allocation strategies</strong>. Each additional position provides decreasing diversification benefits, requiring lower concentration limits as portfolio complexity increases, consistent with modern portfolio theory.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Core methodology</strong>: Creates <strong>scale-dependent risk management</strong> that automatically reduces individual pool allocation limits as vault diversification increases. The formula balances <strong>concentration opportunities</strong> for high-quality pools against <strong>diversification requirements</strong> through exponential decay mechanisms.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Practical examples</strong>: 1 pool → 99.3% max allocation (near-total concentration); 8 pools → 35.2% max (moderate diversification); 16 pools → 27.7% approaching asymptotic floor. Higher diversification factors create stronger decay, while lower factors allow concentration even with many pools.
      </Typography>
      <Typography variant="body2">
        <strong>Mathematical implementation</strong>: Exponential decay function with configurable diversification factor controls decay aggressiveness. Adjust Number of Pools above to see curve changes. This feeds into the <a href="#vault-allocation-section" style={{color: theme.colors.functional.link, textDecoration: 'underline'}}>allocation capping algorithm below</a>.
      </Typography>
      <FormulaLegend items={[
        { symbol: '<em>w<sub>m</sub></em>', text: 'dynamic maximum weight (BP)' },
        { symbol: '<em>w<sub>0</sub></em>', text: 'minimum max weight (BP)' },
        { symbol: '<em>n</em>', text: 'number of pools in vault' },
        { symbol: '<em>d</em>', text: 'diversification factor' },
        { symbol: '<em>w<sub>e</sub></em>', text: 'effective maximum weight (BP)' },
        { symbol: '<em>w<sub>a</sub></em>', text: 'absolute maximum weight (BP)' },
      ]} />
    </DescriptionCard>
  );

  const maxWeightChart = (
    <SimulationCard
      title="Simulation"
      action={
        <Button
          size="small"
          startIcon={<RestoreIcon />}
          onClick={() => updateWeightModel({
            minMaxBp: defaultWeightModel.minMaxBp,
            maxBp: defaultWeightModel.maxBp,
            diversificationFactorBp: defaultWeightModel.diversificationFactorBp
          })}
          sx={{ textTransform: 'none' }}
        >
          Reset
        </Button>
      }
      controls={
        <Box>
          <ParameterSlider
            label="Min Max Weight"
            value={weightModel.minMaxBp}
            onChange={(value) => updateWeightModel({ minMaxBp: Math.min(value, weightModel.maxBp) })}
            min={validation.weightModel.minMaxBp.min}
            max={weightModel.maxBp}
            step={100}
            formatValue={(v) => formatBp(v,0)}
            helperText="Minimum maximum dynamic weight (0-100%)"
          />
          <ParameterSlider
            label="Absolute Max Weight"
            value={weightModel.maxBp}
            onChange={(value) => {
              updateWeightModel({ maxBp: value });
              if (weightModel.minMaxBp > value) {
                updateWeightModel({ minMaxBp: value });
              }
            }}
            min={validation.weightModel.maxBp.min}
            max={validation.weightModel.maxBp.max}
            step={100}
            formatValue={(v) => formatBp(v,0)}
            helperText="Absolute maximum weight per pool (10-100%)"
          />
          <ParameterSlider
            label="Diversification Factor"
            value={weightModel.diversificationFactorBp}
            onChange={(value) => updateWeightModel({ diversificationFactorBp: value })}
            min={validation.weightModel.diversificationFactorBp.min}
            max={validation.weightModel.diversificationFactorBp.max}
            step={100}
            formatValue={(v) => `${(v / BPS).toFixed(2)}`}
            helperText="Exponential decay for max weight (0.05-2.0)"
          />
          <ParameterSlider
            label="Number of Pools in Vault"
            value={simulation.maxWeightPoolCount}
            onChange={updateMaxWeightPoolCount}
            min={1} max={20} step={1}
            helperText="Simulate vault with different pool counts"
            color="green"
          />
          <Box sx={{ mt: 1 }}>
            <SimulationResult
              prefix={`Current Max Weight for ${simulation.maxWeightPoolCount} pools:`}
              values={[
                { key: 'maxWeight', value: formatBp(currentMaxWeightForPoolCount) }
              ]}
              highlighted="maxWeight"
            />
          </Box>
        </Box>
      }
    >
      <ChartContainer>
        <LineChart
          series={[{
            data: maxWeightData.map(d => d.maxWeight),
            label: 'Max Weight (%)',
            color: theme.colors.chart[0],
            showMark: ({ index }) => maxWeightData[index].components === simulation.maxWeightPoolCount,
          }]}
          xAxis={[{
            data: maxWeightData.map(d => d.components),
            label: 'Number of Pools',
            scaleType: 'point',
          }]}
          yAxis={[{ min: 0, max: 100 }]}
          margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
          height={370}
          slotProps={{ legend: { hidden: true } }}
        />
      </ChartContainer>
    </SimulationCard>
  );

  // Section 4: Vault Allocation
  const vaultPoolsCScores = simulation.pools.map(p => p.cScore);
  const currentVaultMaxWeight = componentMaxWeightBp(
    simulation.pools.length,
    weightModel.minMaxBp,
    weightModel.diversificationFactorBp,
    weightModel.maxBp
  );

  const calculatedTargetWeights = targetWeights(
    vaultPoolsCScores,
    Math.min(weightModel.maxBp, currentVaultMaxWeight), // Effective max weight
    BPS,
    weightModel.scoreAmplifierBp
  );

  const calculatedAllocations = targetAllocations(
    vaultPoolsCScores,
    simulation.vaultTvl,
    Math.min(weightModel.maxBp, currentVaultMaxWeight),
    weightModel.scoreAmplifierBp
  );

  const vaultAllocationDescription = (
    <DescriptionCard
      title="Methodology"
      formula={String.raw`w_i = \frac{c_i^p}{\sum_j c_j^p} \cdot 10000 \quad \text{where} \quad w_f = \min(w_i, w_m)`}
    >
      <Typography variant="body2" paragraph>
        <strong>Theoretical foundation</strong>: Implements <strong>constraint optimization theory</strong> and <strong>iterative redistribution algorithms</strong> similar to water-filling principles from information theory. The multi-stage process ensures optimal allocation under diversification constraints while maintaining Nash equilibrium properties that prevent gaming.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Core methodology</strong>: Four-stage allocation process: 1) Exponential scaling using scoreAmplifierBp to amplify quality differences, 2) Normalization to 100% total weight, 3) Dynamic capping using max weights from above, 4) Iterative redistribution of excess weight to uncapped pools until convergence.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Practical examples</strong>: Conservative amplification (0.75-1.0x) creates flat distributions ideal for risk-averse strategies. Aggressive amplification (2.0-2.5x) concentrates allocations in top pools for alpha-seeking approaches. The capping algorithm typically converges in 2-3 iterations, ensuring computational efficiency.
      </Typography>
      <Typography variant="body2">
        <strong>Mathematical implementation</strong>: Power function scaling followed by iterative constraint satisfaction. System continuously monitors pool quality metrics and triggers rebalancing when weight divergence exceeds thresholds through optimized swap sequences across multiple DEXs.
      </Typography>
      <FormulaLegend items={[
        { symbol: '<em>w<sub>i</sub></em>', text: 'normalized weight (BP)' },
        { symbol: '<em>w<sub>f</sub></em>', text: 'final capped weight (BP)' },
        { symbol: '<em>c<sub>i</sub></em>', text: 'composite score for pool <em>i</em>' },
        { symbol: '<em>p</em>', text: 'score amplifier factor' },
        { symbol: '<em>w<sub>m</sub></em>', text: 'dynamic max weight (BP)' },
      ]} />
    </DescriptionCard>
  );

  const vaultAllocationChart = (
    <SimulationCard
      title="Simulation"
      action={
        <Button
          size="small"
          startIcon={<RestoreIcon />}
          onClick={() => {
            updateVaultTvl(10000000); // Reset to $10M
            // Reset pools to default
            const defaultPools = [
              { id: 'A', cScore: 8500 },
              { id: 'B', cScore: 7200 },
              { id: 'C', cScore: 6800 },
              { id: 'D', cScore: 5500 },
            ];
            // Remove all pools and add default ones
            while (simulation.pools.length > 0) {
              removePool(simulation.pools[0].id);
            }
            defaultPools.forEach(pool => {
              addPool();
              updatePoolScore(String.fromCharCode(65 + defaultPools.indexOf(pool)), pool.cScore);
            });
          }}
          sx={{ textTransform: 'none' }}
        >
          Reset
        </Button>
      }
      controls={
        <Stack spacing={2}> {/* Using Stack for better spacing */}
          <ParameterSlider
            label="Score Amplifier"
            value={weightModel.scoreAmplifierBp}
            onChange={(value) => updateWeightModel({ scoreAmplifierBp: value })}
            min={validation.weightModel.scoreAmplifierBp.min}
            max={validation.weightModel.scoreAmplifierBp.max}
            step={100}
            formatValue={(v) => `${(v / BPS).toFixed(2)}x`}
            helperText="Score exponentiation factor (0.75x-2.5x)"
          />
          <ParameterSlider
            label="Diversification Factor"
            value={weightModel.diversificationFactorBp}
            onChange={(value) => updateWeightModel({ diversificationFactorBp: value })}
            min={validation.weightModel.diversificationFactorBp.min}
            max={validation.weightModel.diversificationFactorBp.max}
            step={100}
            formatValue={(v) => `${(v / BPS).toFixed(2)}`}
            helperText="Exponential decay for max weight (0.05-2.0)"
          />
          <ParameterSlider
            label="Vault TVL (USD)"
            value={simulation.vaultTvl}
            onChange={updateVaultTvl}
            min={1000}
            max={1000000000}
            formatValue={formatCurrency}
            helperText="Total value locked in vault (logarithmic scale)"
            logarithmic={true}
            color="green"
          />
          <TableContainer component={Paper} sx={{ maxHeight: 240, border: '1px solid', borderColor: 'divider' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', py: 0.5 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', py: 0.5 }}>C-Score</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', py: 0.5 }}>Allocation</TableCell>
                  <TableCell sx={{ width: '40px', padding: '4px 2px' }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {simulation.pools.map((pool, index) => (
                  <TableRow key={pool.id} sx={{ '& td': { py: 0.5 } }}>
                    <TableCell sx={{ minWidth: '80px' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: theme.chartColors[index % theme.chartColors.length],
                          fontSize: '0.875rem'
                        }}
                      >
                        Pool {pool.id}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ minWidth: '120px' }}>
                      <Box sx={{ width: '100%' }}>
                        <ParameterSlider
                          label=""
                          value={pool.cScore}
                          onChange={(v) => updatePoolScore(pool.id, v)}
                          min={0} max={BPS} step={100}
                          formatValue={formatBp}
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ minWidth: '100px' }}>
                      <Box sx={{ lineHeight: 1.1 }}>
                        <Typography variant="body2" sx={{
                          fontFamily: 'monospace',
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: 'text.primary',
                          mb: 0.1
                        }}>
                          {calculatedAllocations[index] ? formatCurrency(calculatedAllocations[index]) : '$0'}
                        </Typography>
                        <Typography variant="caption" sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          color: 'text.secondary',
                          lineHeight: 1
                        }}>
                          {calculatedTargetWeights[index] ? formatBp(calculatedTargetWeights[index]) : '0.00%'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ padding: '2px' }}>
                      <IconButton
                        aria-label="delete"
                        onClick={() => removePool(pool.id)}
                        disabled={simulation.pools.length <= 1}
                        size="small"
                      >
                        <RemoveCircleOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            onClick={addPool}
            variant="outlined"
            size="small"
            startIcon={<AddCircleOutlineIcon />}
            sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
          >
            Add Pool
          </Button>
        </Stack>
      }
    >
      {calculatedTargetWeights.length > 0 ? (
        <ChartContainer>
          <PieChart
            series={[{
              data: calculatedTargetWeights.map((weight, index) => ({
                id: index,
                value: bpToPercent(weight),
                label: `Pool ${simulation.pools[index].id}`,
                color: theme.chartColors[index % theme.chartColors.length]
              })),
              innerRadius: 60,
              outerRadius: 140,
              paddingAngle: 2,
              cornerRadius: 3,
            }]}
            margin={{ top: 40, bottom: 40, left: 40, right: 40 }}
            slotProps={{ legend: { hidden: true } }}
            height={300}
          />
        </ChartContainer>
      ) : (
        <Typography>Add pools to see allocation.</Typography>
      )}
    </SimulationCard>
  );

  return (
    <Box>
      <Section title="Allocation Model">
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {allocationModelDescription}
          </Box>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {allocationModelParams}
          </Box>
        </Box>
      </Section>

      <Section title="Composite Scoring" id="cscore-section">
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {cScoreParams}
          </Box>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {cScoreChart}
          </Box>
        </Box>
      </Section>

      <Section title="Max Single Weight">
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {maxWeightDescription}
          </Box>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {maxWeightChart}
          </Box>
        </Box>
      </Section>

      <Section title="Vault Target Allocation" id="vault-allocation-section">
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {vaultAllocationDescription}
          </Box>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {vaultAllocationChart}
          </Box>
        </Box>
      </Section>
    </Box>
  );
};

export default AllocationModel;
