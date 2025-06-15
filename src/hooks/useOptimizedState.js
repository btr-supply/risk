import { useMemo } from 'react';
import { useRiskModel } from '../store';
import {
  calculateCScore,
  targetWeights,
  targetAllocations,
  componentMaxWeightBp,
  generateMaxWeightCurveData,
  generateSlippageCurveData,
  generateRatioDiff0CurveDataBoth,
} from '../models';
import {
  formatDollarsAuto,
  formatPercent,
  formatFloatAuto,
} from '../utils/format';

// Memoized calculation hooks to prevent unnecessary recalculations
export const useCalculatedCScore = () => {
  const { simulation } = useRiskModel();

  return useMemo(
    () =>
      calculateCScore(
        simulation.cScores.trust,
        simulation.cScores.liquidity,
        simulation.cScores.performance
      ),
    [
      simulation.cScores.trust,
      simulation.cScores.liquidity,
      simulation.cScores.performance,
    ]
  );
};

export const useCalculatedWeights = () => {
  const { weightModel, simulation } = useRiskModel();

  return useMemo(() => {
    const cScores = simulation.pools.map((pool) => pool.cScore);
    const maxWeight = componentMaxWeightBp(
      simulation.pools.length,
      weightModel.minMaxBp,
      weightModel.diversificationFactorBp,
      weightModel.maxBp
    );

    return targetWeights(
      cScores,
      maxWeight,
      10000, // BPS
      weightModel.scoreAmplifierBp
    );
  }, [
    weightModel.minMaxBp,
    weightModel.diversificationFactorBp,
    weightModel.maxBp,
    weightModel.scoreAmplifierBp,
    simulation.pools,
  ]);
};

export const useCalculatedAllocations = () => {
  const { weightModel, simulation } = useRiskModel();

  return useMemo(() => {
    const cScores = simulation.pools.map((pool) => pool.cScore);
    const maxWeight = componentMaxWeightBp(
      simulation.pools.length,
      weightModel.minMaxBp,
      weightModel.diversificationFactorBp,
      weightModel.maxBp
    );

    return targetAllocations(
      cScores,
      simulation.vaultTvl,
      maxWeight,
      weightModel.scoreAmplifierBp
    );
  }, [
    weightModel.minMaxBp,
    weightModel.diversificationFactorBp,
    weightModel.maxBp,
    weightModel.scoreAmplifierBp,
    simulation.pools,
    simulation.vaultTvl,
  ]);
};

export const useMaxWeightCurveData = () => {
  const { weightModel } = useRiskModel();

  return useMemo(
    () =>
      generateMaxWeightCurveData(
        weightModel.minMaxBp,
        weightModel.diversificationFactorBp,
        weightModel.maxBp,
        50 // points
      ),
    [
      weightModel.minMaxBp,
      weightModel.diversificationFactorBp,
      weightModel.maxBp,
    ]
  );
};

export const useSlippageCurveData = () => {
  const { slippageModel, simulation } = useRiskModel();

  return useMemo(
    () =>
      generateSlippageCurveData(
        slippageModel,
        simulation.slippageRatioDiff0,
        100 // points
      ),
    [slippageModel, simulation.slippageRatioDiff0]
  );
};

export const useRatioDiff0CurveData = () => {
  const { simulation } = useRiskModel();

  return useMemo(
    () =>
      generateRatioDiff0CurveDataBoth(
        simulation.ratioDiff0Simulation,
        100 // points
      ),
    [simulation.ratioDiff0Simulation]
  );
};

// Simple formatters using existing auto formatters - no memoization needed
export const useFormatters = () => {
  // Return static formatter functions using the sophisticated auto formatters
  return {
    currency: formatDollarsAuto,
    percentage: (bp, decimals = 2) => formatPercent(bp / 10000, decimals), // Convert BP to percentage
    number: formatFloatAuto,
    basisPoints: (bp) => `${bp} bp`,
  };
};
