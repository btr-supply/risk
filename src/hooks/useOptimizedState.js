import { useMemo, useCallback } from 'react';
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

// Throttled update functions to prevent excessive re-renders
export const useThrottledUpdates = () => {
  const {
    updateWeightModel,
    updateLiquidityModel,
    updateSlippageModel,
    updateCScores,
    updateRatioDiff0Simulation,
  } = useRiskModel();

  const throttledUpdateWeightModel = useCallback(
    (...args) => throttle(updateWeightModel, 100)(...args),
    [updateWeightModel]
  );

  const throttledUpdateLiquidityModel = useCallback(
    (...args) => throttle(updateLiquidityModel, 100)(...args),
    [updateLiquidityModel]
  );

  const throttledUpdateSlippageModel = useCallback(
    (...args) => throttle(updateSlippageModel, 100)(...args),
    [updateSlippageModel]
  );

  const throttledUpdateCScores = useCallback(
    (...args) => throttle(updateCScores, 100)(...args),
    [updateCScores]
  );

  const throttledUpdateRatioDiff0Simulation = useCallback(
    (...args) => throttle(updateRatioDiff0Simulation, 100)(...args),
    [updateRatioDiff0Simulation]
  );

  return {
    throttledUpdateWeightModel,
    throttledUpdateLiquidityModel,
    throttledUpdateSlippageModel,
    throttledUpdateCScores,
    throttledUpdateRatioDiff0Simulation,
  };
};

// Utility function for throttling
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memoized formatters to prevent recreation on every render
export const useFormatters = () => {
  return useMemo(
    () => ({
      currency: (value, decimals = 0) => {
        if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
        if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
        return `$${value.toFixed(decimals)}`;
      },
      percentage: (bp, decimals = 2) => `${(bp / 100).toFixed(decimals)}%`,
      number: (value, decimals = 0) => {
        if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
        if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
        if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
        return value.toFixed(decimals);
      },
    }),
    []
  );
};
