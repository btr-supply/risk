import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import RestoreIcon from '@mui/icons-material/Restore';
import { LineChart } from '@mui/x-charts';
import { useRiskModel } from '../state';
import {
  BPS,
  generateSlippageCurveData,
  validation,
  calculateSlippage,
  bpToPercent,
  defaultSlippageModel
} from '../models';
import {
  Section,
  ParameterCard,
  DescriptionCard,
  ParameterSlider,
  SimulationCard,
  ChartContainer,
  formatBp,
  FormulaLegend,
  SimulationResult,
} from '../components/index.jsx';

export const SlippageModel = () => {
  const theme = useTheme();
  const {
    slippageModel,
    simulation,
    updateSlippageModel,
    updateSlippageRatioDiff0,
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
        helperText="Minimum slippage, can be negative (-10% to 10%)"
      />
      <ParameterSlider
        label="Max Slippage"
        value={slippageModel.maxSlippageBp}
        onChange={(value) => updateSlippageModel({ maxSlippageBp: value })}
        min={validation.slippageModel.maxSlippageBp.min}
        max={validation.slippageModel.maxSlippageBp.max}
        step={10}
        formatValue={formatBp}
        helperText="Maximum slippage (-10% to 10%, must be greater than min)"
      />
      <ParameterSlider
        label="Amplification Factor"
        value={slippageModel.amplificationBp}
        onChange={(value) => updateSlippageModel({ amplificationBp: value })}
        min={validation.slippageModel.amplificationBp.min}
        max={validation.slippageModel.amplificationBp.max}
        step={100}
        formatValue={(v) => `${(v / BPS).toFixed(2)}`}
        helperText="Controls curve shape (0=concave, 0.5=linear, 1=convex)"
      />
    </ParameterCard>
  );

  const slippageModelDescription = (
    <DescriptionCard title="Methodology" formula={String.raw`\delta = |r_0 - r_t| - |r_1 - r_t| \quad \text{where} \quad r = \frac{b_0}{b_0 + b_1}`}>
      <Typography variant="body2" paragraph>
        <strong>Protocol-Aware Slippage</strong>: The dynamic slippage model uses <strong>ratioDiff0</strong> (-10000 to +10000) to measure how user transactions affect protocol health. This metric represents the change in deviation from the target asset balance ratio.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Dual Purpose Design</strong>: The system incentivizes users to provide liquidity in proper ratios while protecting against MEV attacks and price arbitrage. When ratioDiff0 is positive (beneficial), users receive lower slippage or even rewards. When negative (harmful), higher slippage penalties apply.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Economic Incentives</strong>: This creates natural market forces where users are economically motivated to help maintain optimal protocol balance, while arbitrageurs face increasing costs for extractive behavior.
      </Typography>
      <Typography variant="body2">
        <strong>Research Foundation</strong>: Based on optimal mechanism design and modern MEV protection research. For detailed theoretical foundations and academic references, see the <a href="/docs/metrics/alm-slippage.md" style={{color: theme.colors.functional.link, textDecoration: 'underline'}}>complete documentation</a>.
      </Typography>
      <FormulaLegend items={[
        { symbol: '<em>δ</em>', text: 'ratioDiff0 in basis points' },
        { symbol: '<em>r<sub>0</sub></em>', text: 'current vault ratio' },
        { symbol: '<em>r<sub>1</sub></em>', text: 'post-transaction ratio' },
        { symbol: '<em>r<sub>t</sub></em>', text: 'target ratio' },
        { symbol: '<em>b<sub>0</sub></em>', text: 'token0 balance' },
        { symbol: '<em>b<sub>1</sub></em>', text: 'token1 balance' },
      ]} />
    </DescriptionCard>
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
      formula={String.raw`s(x,a) = \begin{cases} 1-(1-x)^k & \text{if } a \leq 0.5 \\ x^k & \text{if } a > 0.5 \end{cases} \quad \text{where} \quad k = 10^{|a-0.5|/0.25}`}
    >
      <Typography variant="body2" paragraph>
        <strong>Three-Stage Calculation</strong>: The slippage calculation transforms ratioDiff0 (-10000 to +10000 basis points) into final slippage through: 1) Normalize to [0,1], 2) Apply power transformation controlled by amplification, 3) Map linearly to [maxSlippage, minSlippage] bounds.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Amplification Control</strong>: The amplification factor (0-1) controls curve shape: ≤ 0.5 creates concave curves (early penalties for harmful transactions), {'>'}0.5 creates convex curves (gradual penalties then sharp increases). Linear (0.5) provides proportional scaling.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Mathematical Properties</strong>: Uses power functions for computational efficiency vs iterative methods (Curve/Balancer). Smooth transitions at the linear point (0.5) ensure no arbitrage opportunities through discontinuities. Single function evaluation provides gas-efficient on-chain execution.
      </Typography>
      <Typography variant="body2">
        <strong>Interactive Simulation</strong>: Adjust the ratioDiff0 slider above to see how different protocol health values map to slippage. Modify amplification parameters in the first section to observe varying curve shapes and risk preferences.
      </Typography>
      <FormulaLegend items={[
        { symbol: '<em>s</em>', text: 'transformation function' },
        { symbol: '<em>x</em>', text: 'normalized ratio (0-1)' },
        { symbol: '<em>a</em>', text: 'amplification factor (0-1)' },
        { symbol: '<em>k</em>', text: 'calculated exponent' },
      ]} />
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
            updateSlippageRatioDiff0(0);
            updateSlippageModel({ amplificationBp: defaultSlippageModel.amplificationBp });
          }}
          sx={{ textTransform: 'none' }}
        >
          Reset
        </Button>
      }
      controls={
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ParameterSlider
            label="ratioDiff0 (%)"
            value={bpToPercent(simulation.slippageRatioDiff0)}
            onChange={(v) => updateSlippageRatioDiff0(v * 100)} // Convert percent to BP
            min={-100}
            max={100}
            step={1}
            formatValue={(v) => `${v.toFixed(0)}%`}
          />
          <ParameterSlider
            label="Amplification Factor"
            value={slippageModel.amplificationBp}
            onChange={(value) => updateSlippageModel({ amplificationBp: value })}
            min={validation.slippageModel.amplificationBp.min}
            max={validation.slippageModel.amplificationBp.max}
            step={100}
            formatValue={(v) => `${(v / BPS).toFixed(2)}`}
            helperText="Controls curve shape (0=concave, 0.5=linear, 1=convex)"
          />
        </Box>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <SimulationResult
          prefix={`For ratioDiff0 = ${formatBp(simulation.slippageRatioDiff0)}:`}
          values={[
            { key: 'slippage', label: 'Slippage', value: formatBp(currentSlippage) }
          ]}
          highlighted="slippage"
        />
        <ChartContainer>
          <LineChart
            series={[
              {
                data: slippageCurveData.map(d => d.slippage),
                label: 'Slippage (%)',
                color: theme.palette.primary.main,
                curve: 'monotoneX',
                showMark: ({ index }) => slippageCurveData[index].ratioDiff0.toFixed(0) === bpToPercent(simulation.slippageRatioDiff0).toFixed(0)
              },
            ]}
            xAxis={[{
              data: slippageCurveData.map(d => d.ratioDiff0),
              label: 'ratioDiff0 (%)',
              scaleType: 'linear',
              valueFormatter: (value) => `${value.toFixed(0)}%`
            }]}
            yAxis={[{
              min: (() => {
                const minVal = bpToPercent(Math.min(slippageModel.minSlippageBp, slippageModel.maxSlippageBp));
                const maxVal = bpToPercent(Math.max(slippageModel.minSlippageBp, slippageModel.maxSlippageBp));
                const range = maxVal - minVal;
                return minVal - (range * 0.1);
              })(),
              max: (() => {
                const minVal = bpToPercent(Math.min(slippageModel.minSlippageBp, slippageModel.maxSlippageBp));
                const maxVal = bpToPercent(Math.max(slippageModel.minSlippageBp, slippageModel.maxSlippageBp));
                const range = maxVal - minVal;
                return maxVal + (range * 0.1);
              })(),
            }]}
            margin={{ left: 0, right: 30 }}
            slotProps={{ legend: { hidden:true } }}
            tooltip={{ trigger: 'axis' }}
            height={420}
          />
        </ChartContainer>
      </Box>
    </SimulationCard>
  );

  return (
    <Box>
      <Section title="Slippage Model">
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {slippageModelDescription}
          </Box>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {slippageModelParams}
          </Box>
        </Box>
      </Section>

      <Section title="Dynamic Slippage" id="slippage-simulation-section">
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {dynamicSlippageDescription}
          </Box>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {slippageChart}
          </Box>
        </Box>
      </Section>
    </Box>
  );
};

export default SlippageModel;
