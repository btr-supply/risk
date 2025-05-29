import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import RestoreIcon from '@mui/icons-material/Restore';
import { LineChart } from '@mui/x-charts';
import { useRiskModel } from '../state';
import {
  BPS,
  generateLiquidityCurveData,
  validation,
  targetLiquidityRatioBp,
  liquidityTriggers,
  defaultLiquidityModel
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

export const LiquidityModel = () => {
  const theme = useTheme();
  const {
    liquidityModel,
    simulation,
    updateLiquidityModel,
    updateLiquidityTvl,
  } = useRiskModel();

  // Section 1: Liquidity Model Configuration
  const liquidityModelParams = (
    <ParameterCard
      title="Parameters"
      action={
        <Button
          size="small"
          startIcon={<RestoreIcon />}
          onClick={() => updateLiquidityModel(defaultLiquidityModel)}
          sx={{ textTransform: 'none' }}
        >
          Reset
        </Button>
      }
    >
      <ParameterSlider
        label="Min Ratio"
        value={liquidityModel.minRatioBp}
        onChange={(value) => updateLiquidityModel({ minRatioBp: value })}
        min={validation.liquidityModel.minRatioBp.min}
        max={validation.liquidityModel.minRatioBp.max}
        step={100}
        formatValue={formatBp}
        helperText="Asymptotic minimum liquidity ratio (0-100%)"
      />
      <ParameterSlider
        label="TVL Factor"
        value={liquidityModel.tvlFactorBp}
        onChange={(value) => updateLiquidityModel({ tvlFactorBp: value })}
        min={validation.liquidityModel.tvlFactorBp.min}
        max={validation.liquidityModel.tvlFactorBp.max}
        step={100}
        formatValue={(v) => `${(v / BPS).toFixed(2)}`}
        helperText="Linear TVL scaling sensitivity (0.05-2.0)"
      />
      <ParameterSlider
        label="TVL Exponent"
        value={liquidityModel.tvlExponentBp}
        onChange={(value) => updateLiquidityModel({ tvlExponentBp: value })}
        min={validation.liquidityModel.tvlExponentBp.min}
        max={validation.liquidityModel.tvlExponentBp.max}
        step={50} // 0.005 in BPS
        formatValue={(v) => `${(v / BPS).toFixed(3)}`}
        helperText="Exponential decay strength (0.005-0.2)"
      />
      <ParameterSlider
        label="Low Offset"
        value={liquidityModel.lowOffsetBp}
        onChange={(value) => updateLiquidityModel({ lowOffsetBp: value })}
        min={validation.liquidityModel.lowOffsetBp.min}
        max={validation.liquidityModel.lowOffsetBp.max}
        step={100}
        formatValue={formatBp}
        helperText="Low liquidity trigger offset (≥5%)"
      />
      <ParameterSlider
        label="High Offset"
        value={liquidityModel.highOffsetBp}
        onChange={(value) => updateLiquidityModel({ highOffsetBp: value })}
        min={validation.liquidityModel.highOffsetBp.min}
        max={validation.liquidityModel.highOffsetBp.max}
        step={100}
        formatValue={formatBp}
        helperText="High liquidity trigger offset (≥5%)"
      />
    </ParameterCard>
  );

  const liquidityModelDescription = (
    <DescriptionCard title="Methodology" formula={String.raw`r = b + (1-b) \cdot (1 + V \cdot f)^{-e}`}>
      <Typography variant="body2" paragraph>
        <strong>Theoretical foundation</strong>: Implements <strong>optimal cash holdings theory</strong> from corporate finance and <strong>inventory management models</strong> from operations research. The exponential decay function follows <strong>Baumol-Tobin model</strong> principles, where transaction costs and liquidity needs don't scale linearly with vault size, creating economies of scale.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Core methodology</strong>: Dynamic liquidity buffer system using exponential decay based on vault TVL. Larger vaults operate with proportionally lower buffer ratios, while smaller vaults maintain higher ratios for operational stability. The formula balances <strong>capital efficiency</strong> against <strong>operational requirements</strong> through mathematically proven scaling relationships.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Practical advantages</strong>: Enables batch processing of DEX interactions, flow netting to reduce rebalancing frequency, and asynchronous market making across diverse protocols. Users interact only with vault contracts avoiding direct DEX gas costs, while protocol routines handle batch liquidity operations creating 90%+ gas savings per user transaction.
      </Typography>
      <Typography variant="body2">
        <strong>Mathematical implementation</strong>: Exponential decay function with configurable minimum ratio, TVL scaling factor, and decay exponent. Buffer liquidity generates yield through Cash Strategy integration with money markets (AAVE, Compound) while maintaining instant redemption capability, eliminating traditional cash drag.
      </Typography>
      <FormulaLegend items={[
        { symbol: '<em>r</em>', text: 'target ratio' },
        { symbol: '<em>b</em>', text: 'min ratio' },
        { symbol: '<em>V</em>', text: 'vault TVL' },
        { symbol: '<em>f</em>', text: 'TVL factor' },
        { symbol: '<em>e</em>', text: 'exponent' },
      ]} />
    </DescriptionCard>
  );

  // Section 2: Liquidity Buffer Simulation
  const maxTvlForChart = 1000000000; // $1B for chart scale to match slider
  const liquidityCurveData = generateLiquidityCurveData(liquidityModel, maxTvlForChart, 100, true);

  const currentTargetRatio = targetLiquidityRatioBp(
    simulation.liquidityTvl,
    liquidityModel.minRatioBp,
    liquidityModel.tvlFactorBp,
    liquidityModel.tvlExponentBp
  );
  const currentTriggers = liquidityTriggers(currentTargetRatio, liquidityModel.lowOffsetBp, liquidityModel.highOffsetBp);

  const liquidityBufferDescription = (
    <DescriptionCard
      title="Operational Benefits"
      formula={String.raw`T_l = r \cdot (1-o_l) \quad \text{where} \quad T_h = r \cdot (1+o_h)`}
    >
      <Typography variant="body2" paragraph>
        <strong>Theoretical foundation</strong>: The dual-threshold system implements <strong>control theory</strong> and <strong>hysteresis mechanisms</strong> from engineering systems. Prevents oscillation around target ratios while enabling optimal <strong>flow netting</strong> where simultaneous deposits and withdrawals cancel out within operational bounds, based on queuing theory principles.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Core methodology</strong>: Low trigger initiates strategic LP unwinding in optimal batch sizes, while high trigger deploys excess capital during favorable market conditions. This asynchronous approach enables market making in illiquid DEXs and cross-chain protocols that would be impractical for real-time operations.
      </Typography>
      <Typography variant="body2" paragraph>
        <strong>Practical examples</strong>: Traditional approach costs $50-200 per user transaction; BTR buffer reduces this to $2-5 through gas amortization. Cash Strategy integration generates 3-5% APY through money market deployment (AAVE, Compound) while maintaining instant redemption capability, eliminating traditional cash drag.
      </Typography>
      <Typography variant="body2">
        <strong>Mathematical implementation</strong>: Dual-threshold calculation with configurable offset percentages. System eliminates unnecessary DEX interactions and reduces gas costs by 80%+ through trigger-based batching, converting continuous rebalancing to event-driven operations.
      </Typography>
      <FormulaLegend items={[
        { symbol: '<em>T<sub>l</sub></em>', text: 'low trigger threshold' },
        { symbol: '<em>T<sub>h</sub></em>', text: 'high trigger threshold' },
        { symbol: '<em>r</em>', text: 'target ratio' },
        { symbol: '<em>o<sub>l</sub></em>', text: 'low offset' },
        { symbol: '<em>o<sub>h</sub></em>', text: 'high offset' },
      ]} />
    </DescriptionCard>
  );

  const liquidityChart = (
    <SimulationCard
      title="Simulation"
      action={
        <Button
          size="small"
          startIcon={<RestoreIcon />}
          onClick={() => updateLiquidityTvl(1000000)}
          sx={{ textTransform: 'none' }}
        >
          Reset
        </Button>
      }
      controls={
        <Box>
          <ParameterSlider
            label="Current Vault TVL (USD)"
            value={simulation.liquidityTvl}
            onChange={updateLiquidityTvl}
            min={1000}
            max={1000000000}
            formatValue={(v) => formatCurrency(v, 0)}
            helperText="Total value locked in vault (logarithmic scale)"
            logarithmic={true}
            color="green"
          />
          <SimulationResult
            prefix={`For TVL = ${formatCurrency(simulation.liquidityTvl)}:`}
            values={[
              { key: 'target', label: 'Target', value: formatBp(currentTargetRatio) },
              { key: 'low', label: 'Low', value: formatBp(currentTriggers.lowTrigger) },
              { key: 'high', label: 'High', value: formatBp(currentTriggers.highTrigger) }
            ]}
            highlighted="target"
          />
        </Box>
      }
    >
      <ChartContainer>
        <LineChart
          series={[
            {
              data: liquidityCurveData.map(d => d.low),
              label: 'Low Trigger (%)',
              color: theme.palette.secondary.main,
              curve: 'monotoneX',
              showMark: ({ index }) => Math.abs(liquidityCurveData[index].tvl - simulation.liquidityTvl) < (simulation.liquidityTvl * 0.1),
            },
            {
              data: liquidityCurveData.map(d => d.target),
              label: 'Target Ratio (%)',
              color: theme.palette.primary.main,
              curve: 'monotoneX',
              showMark: ({ index }) => Math.abs(liquidityCurveData[index].tvl - simulation.liquidityTvl) < (simulation.liquidityTvl * 0.1),
            },
            {
              data: liquidityCurveData.map(d => d.high),
              label: 'High Trigger (%)',
              color: theme.palette.success.main,
              curve: 'monotoneX',
              showMark: ({ index }) => Math.abs(liquidityCurveData[index].tvl - simulation.liquidityTvl) < (simulation.liquidityTvl * 0.1),
            },
          ]}
          xAxis={[{
            data: liquidityCurveData.map(d => d.tvl),
            label: 'Vault TVL (USD)',
            scaleType: 'log',
            valueFormatter: (value) => formatCurrency(value,0)
          }]}
          yAxis={[{ min:0, max:60, display: false }]}
          slotProps={{ legend: { position: { vertical: 'top', horizontal: 'middle' } } }}
          tooltip={{ trigger: 'axis' }}
          height={650}
        />
      </ChartContainer>
    </SimulationCard>
  );

  return (
    <Box>
      <Section title="Liquidity Model">
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {liquidityModelDescription}
          </Box>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {liquidityModelParams}
          </Box>
        </Box>
      </Section>

      <Section title="Liquidity Buffer" id="buffer-simulation-section">
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {liquidityBufferDescription}
          </Box>
          <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
            {liquidityChart}
          </Box>
        </Box>
      </Section>
    </Box>
  );
};

export default LiquidityModel;
