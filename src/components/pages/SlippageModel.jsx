import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import RestoreIcon from '@mui/icons-material/Restore';
import { useRiskModel } from '../../store';
import {
  BPS,
  generateSlippageCurveData,
  generateRatioDiff0CurveDataBoth,
  calculateRatioDiff0,
  validation,
  calculateSlippage,
  bpformatPercent,
  defaultSlippageModel,
} from '../../models';
import {
  Section,
  ParameterCard,
  DescriptionCard,
  ParameterSlider,
  SimulationCard,
  formatBp,
  formatDollarsAuto,
  FormulaLegend,
  SimulationResult,
  LineChart,
} from '../index.jsx';

export const SlippageModel = () => {
  const theme = useTheme();
  const {
    slippageModel,
    simulation,
    updateSlippageModel,
    updateSlippageRatioDiff0,
    updateRatioDiff0Simulation,
  } = useRiskModel();

  // Section 1: Slippage Model Configuration
  const slippageModelParams = (
    <ParameterCard
      title="Parameters"
      action={
        <Button
          size="small"
          startIcon={<RestoreIcon />}
          onClick={() => updateSlippageModel(defaultSlippageModel)}
          sx={{ textTransform: 'none' }}
        >
          Reset
        </Button>
      }
    >
      <ParameterSlider
        label="Min Slippage"
        value={slippageModel.minSlippageBp}
        onChange={(value) => updateSlippageModel({ minSlippageBp: value })}
        min={validation.slippageModel.minSlippageBp.min}
        max={validation.slippageModel.minSlippageBp.max}
        step={10}
        formatValue={formatBp}
        helperText="Minimum slippage applied when ratioDiff0 = 10000 (best case scenario for protocol). Negative values mean users receive rewards for beneficial transactions that improve vault ratio balance towards target."
      />
      <ParameterSlider
        label="Max Slippage"
        value={slippageModel.maxSlippageBp}
        onChange={(value) => updateSlippageModel({ maxSlippageBp: value })}
        min={validation.slippageModel.maxSlippageBp.min}
        max={validation.slippageModel.maxSlippageBp.max}
        step={10}
        formatValue={formatBp}
        helperText="Maximum slippage applied when ratioDiff0 = -10000 (worst case scenario for protocol). Higher values create stronger penalties for transactions that worsen vault ratio balance away from target."
      />
      <ParameterSlider
        label="Amplification Factor"
        value={slippageModel.amplificationBp}
        onChange={(value) => updateSlippageModel({ amplificationBp: value })}
        min={validation.slippageModel.amplificationBp.min}
        max={validation.slippageModel.amplificationBp.max}
        step={100}
        formatValue={(v) => `${(v / BPS).toFixed(2)}`}
        helperText="Controls slippage curve shape and MEV protection strategy. Values ≤0.5 create concave curves (early penalties), 0.5 = linear scaling, >0.5 create convex curves (gradual then sharp penalties)."
      />
    </ParameterCard>
  );

  const slippageModelDescription = (
    <DescriptionCard
      title="Methodology"
      formula='r_v = b_0/{b_0 + b_1} quad "where" quad delta = f(r_v, r_t, r_n)'
    >
      <Typography variant="body2" paragraph>
        <strong>Core Concept</strong>: The BTR dynamic slippage model aligns
        user incentives with protocol health by adjusting transaction costs
        based on how user actions affect the vault's token balance ratio. The
        system compares the current <strong>vault ratio</strong> (r_vault) with
        the <strong>target ratio</strong> (r_target) to determine optimal
        behavior.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Ratio Definitions</strong>: The vault ratio represents the
        proportion of token0 in the vault (0-100%), while the target ratio
        represents the optimal balance for the protocol's strategy. When these
        ratios differ, the protocol incentivizes transactions that move the
        vault closer to its target through reduced slippage or even rewards.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Incentive Alignment</strong>: Users receive{' '}
        <strong>lower slippage</strong> (or rewards) for transactions that
        improve the vault ratio, and <strong>higher slippage</strong> for
        transactions that worsen it. This creates natural market forces where
        users are economically motivated to help maintain optimal protocol
        balance, while arbitrageurs face increasing costs for extractive
        behavior.
      </Typography>
      <Typography variant="body2">
        <strong>MEV Protection</strong>: The mechanism implements optimal
        mechanism design principles to protect against sandwich attacks and
        manual arbitrage by creating endogenous cost structures that make such
        attacks unprofitable below optimal thresholds. See the sections below
        for detailed{' '}
        <a
          href="#ratiodiff0-section"
          style={{
            color: theme.colors.functional.link,
            textDecoration: 'underline',
          }}
        >
          ratioDiff0 calculation
        </a>{' '}
        and{' '}
        <a
          href="#slippage-simulation-section"
          style={{
            color: theme.colors.functional.link,
            textDecoration: 'underline',
          }}
        >
          slippage application
        </a>
        .
      </Typography>
      <FormulaLegend
        items={[
          {
            symbol: '<em>r<sub>v</sub></em>',
            text: 'current vault token0 ratio (0-100%)',
          },
          {
            symbol: '<em>r<sub>t</sub></em>',
            text: 'target vault token0 ratio (0-100%)',
          },
          { symbol: '<em>b<sub>0</sub></em>', text: 'token0 balance in vault' },
          { symbol: '<em>b<sub>1</sub></em>', text: 'token1 balance in vault' },
          {
            symbol: '<em>δ</em>',
            text: 'ratioDiff0 metric (improvement measure)',
          },
        ]}
      />
    </DescriptionCard>
  );

  // Section 2: RatioDiff0 Calculation
  const { ratioDiff0Simulation } = simulation;

  const currentDepositRatioDiff0 = calculateRatioDiff0(
    ratioDiff0Simulation.vaultBalance,
    ratioDiff0Simulation.vaultRatio0,
    ratioDiff0Simulation.targetRatio0,
    ratioDiff0Simulation.userAmount,
    ratioDiff0Simulation.userRatio0,
    true // deposit
  );

  const currentWithdrawalRatioDiff0 = calculateRatioDiff0(
    ratioDiff0Simulation.vaultBalance,
    ratioDiff0Simulation.vaultRatio0,
    ratioDiff0Simulation.targetRatio0,
    ratioDiff0Simulation.userAmount,
    ratioDiff0Simulation.userRatio0,
    false // withdrawal
  );

  // Use deposit ratioDiff0 for slippage binding (one-way binding only)
  const primaryRatioDiff0 = currentDepositRatioDiff0;

  // One-way binding: ratioDiff0 simulation updates slippage simulation
  React.useEffect(() => {
    updateSlippageRatioDiff0(primaryRatioDiff0);
  }, [primaryRatioDiff0, updateSlippageRatioDiff0]);

  const ratioDiff0CurveData = generateRatioDiff0CurveDataBoth(
    ratioDiff0Simulation,
    100
  );

  const ratioDiff0Description = (
    <DescriptionCard
      title="Methodology"
      formula='delta = abs{r_{v} - r_{t}} - abs{r_{n} - r_{t}} quad "where" quad r_{n} = {b_{0} + Delta_{0}}/{(b_{0} + Delta_{0}) + (b_{1} + Delta_{1})} '
    >
      <Typography variant="body2" paragraph>
        <strong>Theoretical Foundation</strong>: The BTR dynamic slippage model
        implements <strong>optimal mechanism design theory</strong> and{' '}
        <strong>MEV protection research</strong> principles. The power-function
        slippage creates <strong>endogenous cost structures</strong> that make
        sandwich attacks unprofitable while implementing{' '}
        <strong>dynamic pricing barriers</strong> similar to Tobin tax theory.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Calculation Process</strong>: RatioDiff0 (δ) measures the change
        in vault deviation from target caused by a user transaction. The vault
        calculates target ratio as weighted average of liquidity ranges,
        compares current vs simulated post-transaction ratios, then determines
        the improvement/worsening:{' '}
        <code>
          ratioDiff0 = |oldRatio0 - targetRatio0| - |newRatio0 - targetRatio0|
        </code>
        .
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Incentive Alignment</strong>: Following{' '}
        <strong>Vickrey-Clarke-Groves (VCG) mechanism</strong> concepts, users
        pay their <strong>marginal impact</strong> on protocol health. Positive
        ratioDiff0 values indicate beneficial transactions (moving closer to
        target), negative values indicate worsening (moving further from
        target). The mechanism creates <strong>incentive compatibility</strong>{' '}
        where users naturally optimize protocol balance.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Risk Zones</strong>: The chart shows critical thresholds:{' '}
        <strong>+10%</strong> (rewarding/beneficial), <strong>-10%</strong>{' '}
        (penalizing), <strong>-30%</strong> (warning zone), and{' '}
        <strong>-50%</strong> (danger zone). Negative zones indicate high
        potential slippage that will be amplified by the slippage model,
        creating increasing transaction costs to discourage harmful operations.
      </Typography>
      <Typography variant="body2">
        <strong>Interactive Simulation</strong>: Adjust the target ratio below
        to see meaningful ratioDiff0 values. Try setting target ratio different
        from vault ratio, then observe how different user transaction ratios
        affect the ratioDiff0 calculation. This feeds directly into{' '}
        <a
          href="#slippage-simulation-section"
          style={{
            color: theme.colors.functional.link,
            textDecoration: 'underline',
          }}
        >
          slippage calculation
        </a>{' '}
        where negative values result in higher slippage penalties.
      </Typography>
      <FormulaLegend
        items={[
          { symbol: '<em>δ</em>', text: 'ratioDiff0 in basis points' },
          {
            symbol: '<em>r<sub>vault</sub></em>',
            text: 'current vault ratio before transaction',
          },
          {
            symbol: '<em>r<sub>n</sub></em>',
            text: 'vault ratio after transaction',
          },
          { symbol: '<em>r<sub>t</sub></em>', text: 'target vault ratio' },
          {
            symbol: '<em>r<sub>v</sub></em>',
            text: 'vault ratio after transaction',
          },
          {
            symbol: '<em>Δ<sub>0</sub></em>',
            text: 'user token0 amount (+ deposit, - withdrawal)',
          },
          {
            symbol: '<em>Δ<sub>1</sub></em>',
            text: 'user token1 amount (+ deposit, - withdrawal)',
          },
        ]}
      />
    </DescriptionCard>
  );

  const ratioDiff0Chart = (
    <SimulationCard
      title="Simulation"
      action={
        <Button
          size="small"
          startIcon={<RestoreIcon />}
          onClick={() => {
            updateRatioDiff0Simulation({
              vaultBalance: 200000, // $200K
              vaultRatio0: 1500, // 15%
              userAmount: 100000, // $100K
              userRatio0: 7000, // 70%
              targetRatio0: 7000, // 70%
            });
          }}
          sx={{ textTransform: 'none' }}
        >
          Reset
        </Button>
      }
      controls={
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ParameterSlider
            label="Target Ratio0 (%)"
            value={bpformatPercent(ratioDiff0Simulation.targetRatio0)}
            onChange={(v) =>
              updateRatioDiff0Simulation({ targetRatio0: v * 100 })
            }
            min={0}
            max={100}
            step={1}
            formatValue={(v) => `${v.toFixed(0)}%`}
            helperText="Optimal proportion of token0 for vault strategy calculated as weighted average of all liquidity ranges. Critical parameter for determining whether user transactions help or harm protocol balance."
            color="green"
          />
          <ParameterSlider
            label="Vault Total Balance (USD)"
            value={ratioDiff0Simulation.vaultBalance}
            onChange={(value) =>
              updateRatioDiff0Simulation({ vaultBalance: value })
            }
            min={5000}
            max={1000000000}
            formatValue={formatDollarsAuto}
            helperText="Total value locked in vault including both token0 and token1 balances across cash positions and active liquidity provider positions. Affects impact magnitude of user transactions on ratios."
            logarithmic={true}
            color="green"
          />
          <ParameterSlider
            label="Vault Ratio0 (%)"
            value={bpformatPercent(ratioDiff0Simulation.vaultRatio0)}
            onChange={(v) =>
              updateRatioDiff0Simulation({ vaultRatio0: v * 100 })
            }
            min={0}
            max={100}
            step={1}
            formatValue={(v) => `${v.toFixed(0)}%`}
            helperText="Current proportion of token0 in vault before user transaction occurs. Compared against target ratio to determine existing deviation and potential improvement or worsening from user actions."
            color="green"
          />
          <ParameterSlider
            label="User Transaction Amount (USD)"
            value={ratioDiff0Simulation.userAmount}
            onChange={(value) =>
              updateRatioDiff0Simulation({ userAmount: value })
            }
            min={100}
            max={100000000}
            formatValue={formatDollarsAuto}
            helperText="Total transaction size in USD value representing combined value of token0 and token1 amounts in user deposit or withdrawal. Larger transactions have proportionally greater impact on vault ratios."
            logarithmic={true}
            color="secondary"
          />
          <ParameterSlider
            label="User Transaction Ratio0 (%)"
            value={bpformatPercent(ratioDiff0Simulation.userRatio0)}
            onChange={(v) =>
              updateRatioDiff0Simulation({ userRatio0: v * 100 })
            }
            min={0}
            max={100}
            step={1}
            formatValue={(v) => `${v.toFixed(0)}%`}
            helperText="Proportion of token0 in user's transaction determining transaction composition. Key factor influencing whether transaction moves vault ratio closer to or further from target balance."
            color="secondary"
          />
          <Box sx={{ mt: 1 }}>
            <SimulationResult
              prefix={`ratio0: ${bpformatPercent(ratioDiff0Simulation.userRatio0).toFixed(0)}% →`}
              values={[
                {
                  key: 'deposit',
                  label: 'Deposit',
                  value: formatBp(currentDepositRatioDiff0),
                },
                {
                  key: 'withdrawal',
                  label: 'Withdrawal',
                  value: formatBp(currentWithdrawalRatioDiff0),
                },
              ]}
              colors={{
                deposit: theme.colors.chart[1], // Green for deposit
                withdrawal: theme.colors.chart[2], // Orange for withdrawal
              }}
            />
          </Box>
        </Box>
      }
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          minHeight: 280,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <LineChart
          height={400}
          data={{
            labels: ratioDiff0CurveData.map((d) => d.userRatio0),
            datasets: [
              {
                label: 'Deposit RatioDiff0 (%)',
                data: ratioDiff0CurveData.map((d) => d.depositRatioDiff0),
                borderColor: theme.colors.chart[1], // Green color
                backgroundColor: `${theme.colors.chart[1]}20`,
                tension: 0.4, // Smooth curve
                fill: false,
                pointRadius: 0, // No data points by default
                pointHoverRadius: 6, // Show on hover
                borderWidth: 2,
              },
              {
                label: 'Withdrawal RatioDiff0 (%)',
                data: ratioDiff0CurveData.map((d) => d.withdrawalRatioDiff0),
                borderColor: theme.colors.chart[2], // Orange color
                backgroundColor: `${theme.colors.chart[2]}20`,
                tension: 0.4, // Smooth curve
                fill: false,
                pointRadius: 0, // No data points by default
                pointHoverRadius: 6, // Show on hover
                borderWidth: 2,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false, // Allow chart to fill container
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'User Ratio0 (%)',
                },
                ticks: {
                  callback: function (value) {
                    return Math.round(value) + '%'; // Fix rounding errors
                  },
                },
              },
              y: {
                min: -70, // Cap y-axis to -70
                max: 70, // Cap y-axis to +70
                title: {
                  display: true,
                  text: 'RatioDiff0 (%)',
                },
              },
            },
          }}
          referenceLines={[
            // Horizontal reference lines for risk zones
            {
              y: 10,
              label: '+10% Rewarding',
              lineStyle: {
                stroke: theme.colors.washedOff.green,
                strokeDasharray: '4 3',
                strokeWidth: 1,
              },
              labelStyle: {
                fontSize: '12px',
                fill: theme.colors.washedOff.green,
              },
            },
            {
              y: -10,
              label: '-10% Penalizing',
              lineStyle: {
                stroke: theme.colors.washedOff.orange,
                strokeDasharray: '4 3',
                strokeWidth: 1,
              },
              labelStyle: {
                fontSize: '12px',
                fill: theme.colors.washedOff.orange,
              },
            },
            {
              y: -30,
              label: '-30% Warning',
              lineStyle: {
                stroke: theme.colors.washedOff.orange,
                strokeDasharray: '4 3',
                strokeWidth: 1,
              },
              labelStyle: {
                fontSize: '12px',
                fill: theme.colors.washedOff.orange,
              },
            },
            {
              y: -50,
              label: '-50% Danger',
              lineStyle: {
                stroke: theme.colors.washedOff.red,
                strokeDasharray: '4 3',
                strokeWidth: 1,
              },
              labelStyle: {
                fontSize: '12px',
                fill: theme.colors.washedOff.red,
              },
            },
            // Vertical reference line at 50%
            {
              x: 50,
              label: '50%',
              lineStyle: {
                stroke: theme.palette.text.primary, // White
                strokeDasharray: '4 3',
                strokeWidth: 1,
              },
              labelStyle: {
                fontSize: '14px',
                fill: theme.palette.text.primary, // White
              },
            },
            // Current level reference line
            {
              x: bpformatPercent(ratioDiff0Simulation.userRatio0),
              label: `${bpformatPercent(ratioDiff0Simulation.userRatio0).toFixed(0)}%`,
              lineStyle: {
                stroke: theme.colors.chart[1], // Green
                strokeDasharray: '4 3',
                strokeWidth: 2,
              },
              labelStyle: {
                fontSize: '12px',
                fill: theme.colors.chart[1],
              },
            },
          ]}
        />
      </Box>
    </SimulationCard>
  );

  // Section 2: Dynamic Slippage Simulation
  const slippageCurveData = generateSlippageCurveData(slippageModel, 500);
  const currentSlippage = calculateSlippage(
    simulation.slippageRatioDiff0,
    slippageModel.minSlippageBp,
    slippageModel.maxSlippageBp,
    slippageModel.amplificationBp
  );

  const dynamicSlippageDescription = (
    <DescriptionCard
      title="Methodology"
      formula='s(x,a) = {| 1-(1-x)^k, quad "if" quad a <= 0.5;; x^k quad "if" quad a > 0.5::| quad "where" quad k = 10^e quad and quad e=abs{a-0.5}/0.25 quad'
    >
      <Typography variant="body2" paragraph>
        <strong>Three-Stage Calculation</strong>: The slippage calculation
        transforms ratioDiff0 (-10000 to +10000 basis points) into final
        slippage through: 1) Normalize to [0,1], 2) Apply power transformation
        controlled by amplification, 3) Map linearly to [maxSlippage,
        minSlippage] bounds.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Amplification Control</strong>: The amplification factor (0-1)
        controls curve shape: ≤ 0.5 creates concave curves (early penalties for
        harmful transactions), {'>'}0.5 creates convex curves (gradual penalties
        then sharp increases). Linear (0.5) provides proportional scaling.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Mathematical Properties</strong>: Uses power functions for
        computational efficiency vs iterative methods (Curve/Balancer). Smooth
        transitions at the linear point (0.5) ensure no arbitrage opportunities
        through discontinuities. Single function evaluation provides
        gas-efficient on-chain execution.
      </Typography>
      <Typography variant="body2">
        <strong>Interactive Simulation</strong>: Adjust the ratioDiff0 slider
        above to see how different protocol health values map to slippage.
        Modify amplification parameters in the first section to observe varying
        curve shapes and risk preferences.
      </Typography>
      <FormulaLegend
        items={[
          { symbol: '<em>s</em>', text: 'transformation function' },
          { symbol: '<em>x</em>', text: 'normalized ratio (0-1)' },
          { symbol: '<em>a</em>', text: 'amplification factor (0-1)' },
          { symbol: '<em>k</em>', text: 'calculated exponent' },
        ]}
      />
    </DescriptionCard>
  );

  const slippageChart = (
    <SimulationCard
      title="Simulation"
      action={
        <Button
          size="small"
          startIcon={<RestoreIcon />}
          onClick={() => {
            updateSlippageRatioDiff0(primaryRatioDiff0);
            updateSlippageModel({
              amplificationBp: defaultSlippageModel.amplificationBp,
            });
          }}
          sx={{ textTransform: 'none' }}
        >
          Reset
        </Button>
      }
      controls={
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ParameterSlider
            label="Amplification Factor"
            value={slippageModel.amplificationBp}
            onChange={(value) =>
              updateSlippageModel({ amplificationBp: value })
            }
            min={validation.slippageModel.amplificationBp.min}
            max={validation.slippageModel.amplificationBp.max}
            step={100}
            formatValue={(v) => `${(v / BPS).toFixed(2)}`}
            helperText="Controls slippage curve shape and MEV protection strategy. Values ≤0.5 create concave curves (early penalties), 0.5 = linear scaling, >0.5 create convex curves (gradual then sharp penalties)."
          />
          <ParameterSlider
            label="ratioDiff0 (%)"
            value={bpformatPercent(simulation.slippageRatioDiff0)}
            onChange={(v) => {
              updateSlippageRatioDiff0(v * 100);
            }}
            min={-100}
            max={100}
            step={1}
            formatValue={(v) => `${v.toFixed(0)}%`}
            helperText="Protocol health metric measuring how user transaction affects vault ratio versus target. Positive values indicate beneficial transactions (reduced slippage), negative values indicate harmful transactions (increased slippage)."
            color="secondary"
          />
        </Box>
      }
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <SimulationResult
          prefix={`ratioDiff0: ${formatBp(simulation.slippageRatioDiff0)} →`}
          values={[
            {
              key: 'slippage',
              label: 'Slippage',
              value: formatBp(currentSlippage),
            },
          ]}
          colors={{
            slippage: theme.colors.chart[1], // Green for consistency
          }}
        />
        <LineChart
          height={450}
          data={{
            datasets: [
              {
                label: 'Slippage (%)',
                data: slippageCurveData.map((d) => ({
                  x: d.ratioDiff0,
                  y: d.slippage,
                })),
                borderColor: theme.palette.primary.main, // Primary blue
                backgroundColor: `${theme.palette.primary.main}20`,
                tension: 0.4, // Smooth curve
                fill: false,
                pointRadius: 0, // No data points by default
                pointHoverRadius: 6, // Show on hover
                borderWidth: 2,
              },
            ],
          }}
          options={{
            scales: {
              x: {
                type: 'linear', // Explicitly set as linear scale
                min: -100, // Force x-axis range
                max: 100, // Force x-axis range
                title: {
                  display: true,
                  text: 'ratioDiff0 (%)',
                },
                ticks: {
                  callback: function (value) {
                    return Math.round(value) + '%'; // Fix rounding errors
                  },
                },
              },
              y: {
                min: (() => {
                  const minVal = bpformatPercent(
                    Math.min(
                      slippageModel.minSlippageBp,
                      slippageModel.maxSlippageBp
                    )
                  );
                  const maxVal = bpformatPercent(
                    Math.max(
                      slippageModel.minSlippageBp,
                      slippageModel.maxSlippageBp
                    )
                  );
                  const range = maxVal - minVal;
                  return minVal - range * 0.1;
                })(),
                max: (() => {
                  const minVal = bpformatPercent(
                    Math.min(
                      slippageModel.minSlippageBp,
                      slippageModel.maxSlippageBp
                    )
                  );
                  const maxVal = bpformatPercent(
                    Math.max(
                      slippageModel.minSlippageBp,
                      slippageModel.maxSlippageBp
                    )
                  );
                  const range = maxVal - minVal;
                  return maxVal + range * 0.1;
                })(),
                title: {
                  display: true,
                  text: 'Slippage (%)',
                },
              },
            },
          }}
          referenceLines={[
            // Current level reference line - fix broken positioning
            {
              x: bpformatPercent(simulation.slippageRatioDiff0),
              label: `${bpformatPercent(simulation.slippageRatioDiff0).toFixed(0)}%`,
              lineStyle: {
                stroke: theme.colors.chart[1], // Green
                strokeDasharray: '4 3',
                strokeWidth: 2,
              },
              labelStyle: {
                fontSize: '12px',
                fill: theme.colors.chart[1],
              },
            },
            // Neutral point reference line at 0%
            {
              x: 0,
              label: 'No diff',
              lineStyle: {
                stroke: theme.palette.text.primary, // White
                strokeDasharray: '4 3',
                strokeWidth: 1,
              },
              labelStyle: {
                fontSize: '12px',
                fill: theme.palette.text.primary, // White
              },
            },
          ]}
        />
      </Box>
    </SimulationCard>
  );

  return (
    <Box>
      <Section title="Slippage Model" id="slippage-model-section">
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {slippageModelDescription}
          </Box>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {slippageModelParams}
          </Box>
        </Box>
      </Section>

      <Section title="Ratio Diff 0" id="ratiodiff0-section">
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {ratioDiff0Description}
          </Box>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {ratioDiff0Chart}
          </Box>
        </Box>
      </Section>

      <Section title="Dynamic Slippage" id="slippage-simulation-section">
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {dynamicSlippageDescription}
          </Box>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>{slippageChart}</Box>
        </Box>
      </Section>
    </Box>
  );
};

export default SlippageModel;
