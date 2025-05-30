import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react';
import {
  defaultWeightModel,
  defaultLiquidityModel,
  defaultSlippageModel,
  validation,
} from './models.js';

// Initial state
const initialState = {
  weightModel: { ...defaultWeightModel },
  liquidityModel: { ...defaultLiquidityModel },
  slippageModel: { ...defaultSlippageModel },
  // Simulation state
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
    // RatioDiff0 simulation parameters
    ratioDiff0Simulation: {
      vaultBalance: 200000, // Total vault balance in USD ($200K)
      vaultRatio0: 1500, // Current vault ratio0 in BP (15%)
      userAmount: 100000, // User transaction amount in USD ($100K)
      userRatio0: 7000, // User transaction ratio0 in BP (70%)
      targetRatio0: 7000, // Target ratio0 in BP (70%)
    },
  },
};

// Action types
const ActionTypes = {
  UPDATE_WEIGHT_MODEL: 'UPDATE_WEIGHT_MODEL',
  UPDATE_LIQUIDITY_MODEL: 'UPDATE_LIQUIDITY_MODEL',
  UPDATE_SLIPPAGE_MODEL: 'UPDATE_SLIPPAGE_MODEL',
  UPDATE_C_SCORES: 'UPDATE_C_SCORES',
  UPDATE_MAX_WEIGHT_POOL_COUNT: 'UPDATE_MAX_WEIGHT_POOL_COUNT',
  UPDATE_VAULT_TVL: 'UPDATE_VAULT_TVL',
  UPDATE_POOLS: 'UPDATE_POOLS',
  ADD_POOL: 'ADD_POOL',
  REMOVE_POOL: 'REMOVE_POOL',
  UPDATE_POOL_SCORE: 'UPDATE_POOL_SCORE',
  UPDATE_LIQUIDITY_TVL: 'UPDATE_LIQUIDITY_TVL',
  UPDATE_SLIPPAGE_RATIO_DIFF0: 'UPDATE_SLIPPAGE_RATIO_DIFF0',
  UPDATE_RATIO_DIFF0_SIMULATION: 'UPDATE_RATIO_DIFF0_SIMULATION',
  RESET_TO_DEFAULTS: 'RESET_TO_DEFAULTS',
};

// Validation helper
const validateParameter = (modelType, param, value) => {
  const constraints = validation[modelType]?.[param];
  if (!constraints) return value;
  return Math.max(constraints.min, Math.min(constraints.max, value));
};

// Reducer
const riskModelReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_WEIGHT_MODEL: {
      const updatedModel = { ...state.weightModel };
      Object.entries(action.payload).forEach(([key, value]) => {
        updatedModel[key] = validateParameter('weightModel', key, value);
      });
      return {
        ...state,
        weightModel: updatedModel,
      };
    }

    case ActionTypes.UPDATE_LIQUIDITY_MODEL: {
      const updatedModel = { ...state.liquidityModel };
      Object.entries(action.payload).forEach(([key, value]) => {
        updatedModel[key] = validateParameter('liquidityModel', key, value);
      });
      return {
        ...state,
        liquidityModel: updatedModel,
      };
    }

    case ActionTypes.UPDATE_SLIPPAGE_MODEL: {
      const updatedModel = { ...state.slippageModel };
      Object.entries(action.payload).forEach(([key, value]) => {
        updatedModel[key] = validateParameter('slippageModel', key, value);
      });
      // Ensure maxSlippageBp > minSlippageBp
      if (updatedModel.maxSlippageBp <= updatedModel.minSlippageBp) {
        if (action.payload.maxSlippageBp !== undefined) {
          updatedModel.minSlippageBp = updatedModel.maxSlippageBp - 10;
        } else if (action.payload.minSlippageBp !== undefined) {
          updatedModel.maxSlippageBp = updatedModel.minSlippageBp + 10;
        }
      }
      return {
        ...state,
        slippageModel: updatedModel,
      };
    }

    case ActionTypes.UPDATE_C_SCORES:
      return {
        ...state,
        simulation: {
          ...state.simulation,
          cScores: {
            ...state.simulation.cScores,
            ...action.payload,
          },
        },
      };

    case ActionTypes.UPDATE_MAX_WEIGHT_POOL_COUNT:
      return {
        ...state,
        simulation: {
          ...state.simulation,
          maxWeightPoolCount: Math.max(1, Math.min(20, action.payload)),
        },
      };

    case ActionTypes.UPDATE_VAULT_TVL:
      return {
        ...state,
        simulation: {
          ...state.simulation,
          vaultTvl: Math.max(1000, action.payload),
        },
      };

    case ActionTypes.UPDATE_POOLS:
      return {
        ...state,
        simulation: {
          ...state.simulation,
          pools: action.payload,
        },
      };

    case ActionTypes.ADD_POOL: {
      const newPoolId = String.fromCharCode(65 + state.simulation.pools.length); // A, B, C, etc.
      const newPool = {
        id: newPoolId,
        cScore: state.weightModel.defaultCScore,
      };
      return {
        ...state,
        simulation: {
          ...state.simulation,
          pools: [...state.simulation.pools, newPool],
        },
      };
    }

    case ActionTypes.REMOVE_POOL: {
      if (state.simulation.pools.length <= 1) return state; // Keep at least one pool
      return {
        ...state,
        simulation: {
          ...state.simulation,
          pools: state.simulation.pools.filter(
            (pool) => pool.id !== action.payload
          ),
        },
      };
    }

    case ActionTypes.UPDATE_POOL_SCORE:
      return {
        ...state,
        simulation: {
          ...state.simulation,
          pools: state.simulation.pools.map((pool) =>
            pool.id === action.payload.poolId
              ? {
                  ...pool,
                  cScore: Math.max(0, Math.min(10000, action.payload.cScore)),
                }
              : pool
          ),
        },
      };

    case ActionTypes.UPDATE_LIQUIDITY_TVL:
      return {
        ...state,
        simulation: {
          ...state.simulation,
          liquidityTvl: Math.max(1000, action.payload),
        },
      };

    case ActionTypes.UPDATE_SLIPPAGE_RATIO_DIFF0:
      return {
        ...state,
        simulation: {
          ...state.simulation,
          slippageRatioDiff0: Math.max(-10000, Math.min(10000, action.payload)),
        },
      };

    case ActionTypes.UPDATE_RATIO_DIFF0_SIMULATION:
      return {
        ...state,
        simulation: {
          ...state.simulation,
          ratioDiff0Simulation: {
            ...state.simulation.ratioDiff0Simulation,
            ...action.payload,
          },
        },
      };

    case ActionTypes.RESET_TO_DEFAULTS:
      return {
        ...initialState,
        weightModel: { ...defaultWeightModel },
        liquidityModel: { ...defaultLiquidityModel },
        slippageModel: { ...defaultSlippageModel },
      };

    default:
      return state;
  }
};

// Context
const RiskModelContext = createContext();

// Provider component
export const RiskModelProvider = ({ children }) => {
  const [state, dispatch] = useReducer(riskModelReducer, initialState);

  // Action creators
  const updateWeightModel = useCallback((updates) => {
    dispatch({ type: ActionTypes.UPDATE_WEIGHT_MODEL, payload: updates });
  }, []);

  const updateLiquidityModel = useCallback((updates) => {
    dispatch({ type: ActionTypes.UPDATE_LIQUIDITY_MODEL, payload: updates });
  }, []);

  const updateSlippageModel = useCallback((updates) => {
    dispatch({ type: ActionTypes.UPDATE_SLIPPAGE_MODEL, payload: updates });
  }, []);

  const updateCScores = useCallback((scores) => {
    dispatch({ type: ActionTypes.UPDATE_C_SCORES, payload: scores });
  }, []);

  const updateMaxWeightPoolCount = useCallback((count) => {
    dispatch({
      type: ActionTypes.UPDATE_MAX_WEIGHT_POOL_COUNT,
      payload: count,
    });
  }, []);

  const updateVaultTvl = useCallback((tvl) => {
    dispatch({ type: ActionTypes.UPDATE_VAULT_TVL, payload: tvl });
  }, []);

  const updatePools = useCallback((pools) => {
    dispatch({ type: ActionTypes.UPDATE_POOLS, payload: pools });
  }, []);

  const addPool = useCallback(() => {
    dispatch({ type: ActionTypes.ADD_POOL });
  }, []);

  const removePool = useCallback((poolId) => {
    dispatch({ type: ActionTypes.REMOVE_POOL, payload: poolId });
  }, []);

  const updatePoolScore = useCallback((poolId, cScore) => {
    dispatch({
      type: ActionTypes.UPDATE_POOL_SCORE,
      payload: { poolId, cScore },
    });
  }, []);

  const updateLiquidityTvl = useCallback((tvl) => {
    dispatch({ type: ActionTypes.UPDATE_LIQUIDITY_TVL, payload: tvl });
  }, []);

  const updateSlippageRatioDiff0 = useCallback((ratioDiff0) => {
    dispatch({
      type: ActionTypes.UPDATE_SLIPPAGE_RATIO_DIFF0,
      payload: ratioDiff0,
    });
  }, []);

  const updateRatioDiff0Simulation = useCallback((updates) => {
    dispatch({
      type: ActionTypes.UPDATE_RATIO_DIFF0_SIMULATION,
      payload: updates,
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_TO_DEFAULTS });
  }, []);

  const value = {
    // State
    ...state,

    // Actions
    updateWeightModel,
    updateLiquidityModel,
    updateSlippageModel,
    updateCScores,
    updateMaxWeightPoolCount,
    updateVaultTvl,
    updatePools,
    addPool,
    removePool,
    updatePoolScore,
    updateLiquidityTvl,
    updateSlippageRatioDiff0,
    updateRatioDiff0Simulation,
    resetToDefaults,
  };

  return (
    <RiskModelContext.Provider value={value}>
      {children}
    </RiskModelContext.Provider>
  );
};

// Hook to use the context
export const useRiskModel = () => {
  const context = useContext(RiskModelContext);
  if (!context) {
    throw new Error('useRiskModel must be used within a RiskModelProvider');
  }
  return context;
};

export default RiskModelContext;
