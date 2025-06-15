'use client';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  defaultWeightModel,
  defaultLiquidityModel,
  defaultSlippageModel,
  validation,
} from './models.js';

// Validation helper
const validateParameter = (modelType, param, value) => {
  const constraints = validation[modelType]?.[param];
  if (!constraints) return value;
  return Math.max(constraints.min, Math.min(constraints.max, value));
};

// Initial state
const initialState = {
  weightModel: { ...defaultWeightModel },
  liquidityModel: { ...defaultLiquidityModel },
  slippageModel: { ...defaultSlippageModel },

  simulation: {
    cScores: {
      trust: 7500,
      liquidity: 8000,
      performance: 6500,
    },
    maxWeightPoolCount: 5,
    vaultTvl: 10000000, // $10M
    pools: [
      { id: 'A', cScore: 8500 },
      { id: 'B', cScore: 7200 },
      { id: 'C', cScore: 6800 },
      { id: 'D', cScore: 5500 },
    ],
    liquidityTvl: 50000000, // $50M
    slippageRatioDiff0: 0, // Current ratioDiff0
    ratioDiff0Simulation: {
      vaultBalance: 200000, // Total vault balance in USD ($200K)
      vaultRatio0: 1500, // Current vault ratio0 in BP (15%)
      userAmount: 100000, // User transaction amount in USD ($100K)
      userRatio0: 7000, // User transaction ratio0 in BP (70%)
      targetRatio0: 7000, // Target ratio0 in BP (70%)
    },
  },
};

export const useRiskModel = create(
  immer((set) => ({
    ...initialState,

    // Weight Model Actions
    updateWeightModel: (updates) =>
      set((state) => {
        Object.entries(updates).forEach(([key, value]) => {
          state.weightModel[key] = validateParameter('weightModel', key, value);
        });
      }),

    // Liquidity Model Actions
    updateLiquidityModel: (updates) =>
      set((state) => {
        Object.entries(updates).forEach(([key, value]) => {
          state.liquidityModel[key] = validateParameter(
            'liquidityModel',
            key,
            value
          );
        });
      }),

    // Slippage Model Actions
    updateSlippageModel: (updates) =>
      set((state) => {
        Object.entries(updates).forEach(([key, value]) => {
          state.slippageModel[key] = validateParameter(
            'slippageModel',
            key,
            value
          );
        });

        // Ensure maxSlippageBp > minSlippageBp
        if (
          state.slippageModel.maxSlippageBp <= state.slippageModel.minSlippageBp
        ) {
          if (updates.maxSlippageBp !== undefined) {
            state.slippageModel.minSlippageBp =
              state.slippageModel.maxSlippageBp - 10;
          } else if (updates.minSlippageBp !== undefined) {
            state.slippageModel.maxSlippageBp =
              state.slippageModel.minSlippageBp + 10;
          }
        }
      }),

    // Simulation Actions
    updateCScores: (scores) =>
      set((state) => {
        Object.assign(state.simulation.cScores, scores);
      }),

    updateMaxWeightPoolCount: (count) =>
      set((state) => {
        state.simulation.maxWeightPoolCount = Math.max(1, Math.min(20, count));
      }),

    updateVaultTvl: (tvl) =>
      set((state) => {
        state.simulation.vaultTvl = Math.max(1000, tvl);
      }),

    updatePools: (pools) =>
      set((state) => {
        state.simulation.pools = pools;
      }),

    addPool: () =>
      set((state) => {
        const newPoolId = String.fromCharCode(
          65 + state.simulation.pools.length
        );
        const newPool = {
          id: newPoolId,
          cScore: state.weightModel.defaultCScore,
        };
        state.simulation.pools.push(newPool);
      }),

    removePool: (poolId) =>
      set((state) => {
        if (state.simulation.pools.length > 1) {
          state.simulation.pools = state.simulation.pools.filter(
            (pool) => pool.id !== poolId
          );
        }
      }),

    updatePoolScore: (poolId, cScore) =>
      set((state) => {
        const pool = state.simulation.pools.find((p) => p.id === poolId);
        if (pool) {
          pool.cScore = Math.max(0, Math.min(10000, cScore));
        }
      }),

    updateLiquidityTvl: (tvl) =>
      set((state) => {
        state.simulation.liquidityTvl = Math.max(1000, tvl);
      }),

    updateSlippageRatioDiff0: (ratioDiff0) =>
      set((state) => {
        state.simulation.slippageRatioDiff0 = Math.max(
          -10000,
          Math.min(10000, ratioDiff0)
        );
      }),

    updateRatioDiff0Simulation: (updates) =>
      set((state) => {
        Object.assign(state.simulation.ratioDiff0Simulation, updates);
      }),

    resetToDefaults: () =>
      set(() => ({
        ...initialState,
        weightModel: { ...defaultWeightModel },
        liquidityModel: { ...defaultLiquidityModel },
        slippageModel: { ...defaultSlippageModel },
      })),
  }))
);
