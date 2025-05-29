// BTR Risk Model Calculations
// Ported from LibRisk.sol
//
// This JavaScript implementation matches the Solidity contract's:
// - Default model parameters (defaultWeightModel, defaultLiquidityModel, defaultSlippageModel)
// - Validation constraints (validateWeightModel, validateLiquidityModel, validateSlippageModel)
// - Key constraint: minSlippageBp < maxSlippageBp and maxSlippageBp <= 1000 BP

// Constants
export const BPS = 10000; // 100% in basis points
export const WAD = 1e18;

// Default model configurations from LibRisk.sol
export const defaultWeightModel = {
  defaultCScore: 5000, // 50%
  scoreAmplifierBp: 15000, // 1.5x
  minMaxBp: 2500, // 25%
  maxBp: 10000, // 100%
  diversificationFactorBp: 3000, // 0.3
};

export const defaultLiquidityModel = {
  minRatioBp: 500, // 5%
  tvlExponentBp: 3000, // 30% - same as tvlFactorBp
  tvlFactorBp: 3000, // 30%
  lowOffsetBp: 5000, // 50%
  highOffsetBp: 5000, // 50%
};

export const defaultSlippageModel = {
  minSlippageBp: 10, // 0.1%
  maxSlippageBp: 500, // 5%
  amplificationBp: 5000, // 0.5 (linear)
};

// Validation ranges from LibRisk.sol
export const validation = {
  weightModel: {
    scoreAmplifierBp: { min: 7500, max: 25000 },
    maxBp: { min: 1000, max: 10000 },
    minMaxBp: { min: 0, max: 10000 },
    diversificationFactorBp: { min: 500, max: 20000 },
    defaultCScore: { min: 0, max: 10000 },
  },
  liquidityModel: {
    minRatioBp: { min: 0, max: 10000 },
    tvlExponentBp: { min: 500, max: 20000 },
    tvlFactorBp: { min: 500, max: 20000 },
    lowOffsetBp: { min: 500, max: 10000 },
    highOffsetBp: { min: 500, max: 10000 },
  },
  slippageModel: {
    minSlippageBp: { min: 0, max: 1000 }, // Can be any value, but must be < maxSlippageBp
    maxSlippageBp: { min: 0, max: 1000 }, // Must be <= 1000 BP (10%) and > minSlippageBp
    amplificationBp: { min: 0, max: 10000 },
  },
};

// Utility functions
export const toWad = (bp) => (bp * WAD) / BPS;
export const toBp = (wad) => (wad * BPS) / WAD;
export const bpToPercent = (bp) => bp / 100;
export const percentToBp = (percent) => percent * 100;

// Math utilities (simplified versions of LibMaths functions)
export const mulWad = (a, b) => (a * b) / WAD;
export const divWad = (a, b) => (a * WAD) / b;
export const powWad = (base, exp) => Math.pow(base / WAD, exp / WAD) * WAD;
export const expWad = (x) => Math.exp(x / WAD) * WAD;
export const lnWad = (x) => Math.log(x / WAD) * WAD;

// VALIDATION FUNCTIONS

/**
 * Validate weight model parameters
 * @param {object} model - Weight model to validate
 * @throws {Error} If validation fails
 */
export const validateWeightModel = (model) => {
  const v = validation.weightModel;

  if (model.scoreAmplifierBp < v.scoreAmplifierBp.min || model.scoreAmplifierBp > v.scoreAmplifierBp.max) {
    throw new Error(`scoreAmplifierBp must be between ${v.scoreAmplifierBp.min} and ${v.scoreAmplifierBp.max}`);
  }
  if (model.maxBp < v.maxBp.min || model.maxBp > v.maxBp.max) {
    throw new Error(`maxBp must be between ${v.maxBp.min} and ${v.maxBp.max}`);
  }
  if (model.minMaxBp < v.minMaxBp.min || model.minMaxBp > v.minMaxBp.max) {
    throw new Error(`minMaxBp must be between ${v.minMaxBp.min} and ${v.minMaxBp.max}`);
  }
  if (model.diversificationFactorBp < v.diversificationFactorBp.min || model.diversificationFactorBp > v.diversificationFactorBp.max) {
    throw new Error(`diversificationFactorBp must be between ${v.diversificationFactorBp.min} and ${v.diversificationFactorBp.max}`);
  }
  if (model.defaultCScore < v.defaultCScore.min || model.defaultCScore > v.defaultCScore.max) {
    throw new Error(`defaultCScore must be between ${v.defaultCScore.min} and ${v.defaultCScore.max}`);
  }
};

/**
 * Validate liquidity model parameters
 * @param {object} model - Liquidity model to validate
 * @throws {Error} If validation fails
 */
export const validateLiquidityModel = (model) => {
  const v = validation.liquidityModel;

  if (model.minRatioBp < v.minRatioBp.min || model.minRatioBp > v.minRatioBp.max) {
    throw new Error(`minRatioBp must be between ${v.minRatioBp.min} and ${v.minRatioBp.max}`);
  }
  if (model.tvlExponentBp < v.tvlExponentBp.min || model.tvlExponentBp > v.tvlExponentBp.max) {
    throw new Error(`tvlExponentBp must be between ${v.tvlExponentBp.min} and ${v.tvlExponentBp.max}`);
  }
  if (model.tvlFactorBp < v.tvlFactorBp.min || model.tvlFactorBp > v.tvlFactorBp.max) {
    throw new Error(`tvlFactorBp must be between ${v.tvlFactorBp.min} and ${v.tvlFactorBp.max}`);
  }
  if (model.lowOffsetBp < v.lowOffsetBp.min || model.lowOffsetBp > v.lowOffsetBp.max) {
    throw new Error(`lowOffsetBp must be between ${v.lowOffsetBp.min} and ${v.lowOffsetBp.max}`);
  }
  if (model.highOffsetBp < v.highOffsetBp.min || model.highOffsetBp > v.highOffsetBp.max) {
    throw new Error(`highOffsetBp must be between ${v.highOffsetBp.min} and ${v.highOffsetBp.max}`);
  }
};

/**
 * Validate slippage model parameters
 * @param {object} model - Slippage model to validate
 * @throws {Error} If validation fails
 */
export const validateSlippageModel = (model) => {
  const v = validation.slippageModel;

  // Check individual ranges
  if (model.minSlippageBp < v.minSlippageBp.min || model.minSlippageBp > v.minSlippageBp.max) {
    throw new Error(`minSlippageBp must be between ${v.minSlippageBp.min} and ${v.minSlippageBp.max}`);
  }
  if (model.maxSlippageBp < v.maxSlippageBp.min || model.maxSlippageBp > v.maxSlippageBp.max) {
    throw new Error(`maxSlippageBp must be between ${v.maxSlippageBp.min} and ${v.maxSlippageBp.max}`);
  }
  if (model.amplificationBp < v.amplificationBp.min || model.amplificationBp > v.amplificationBp.max) {
    throw new Error(`amplificationBp must be between ${v.amplificationBp.min} and ${v.amplificationBp.max}`);
  }

  // Check ordering constraint (matches Solidity: minSlippageBp < maxSlippageBp)
  if (model.minSlippageBp >= model.maxSlippageBp) {
    throw new Error(`minSlippageBp (${model.minSlippageBp}) must be less than maxSlippageBp (${model.maxSlippageBp})`);
  }
};

/**
 * Validate complete risk model
 * @param {object} model - Risk model with weight, liquidity, and slippage models
 * @throws {Error} If validation fails
 */
export const validateRiskModel = (model) => {
  validateWeightModel(model.weight);
  validateLiquidityModel(model.liquidity);
  validateSlippageModel(model.slippage);
};

// WEIGHT MODEL FUNCTIONS

/**
 * Calculate geometric mean composite score (cScore)
 * @param {number[]} scores - Array of individual scores (0-10000)
 * @returns {number} Composite score (0-10000)
 */
export const calculateCScore = (scores) => {
  if (scores.length === 0) return 0;
  if (scores.length === 1) return scores[0];

  // Check for zero scores
  if (scores.some(score => score === 0)) return 0;

  // Calculate geometric mean
  const product = scores.reduce((acc, score) => acc * (score / BPS), 1);
  const geometricMean = Math.pow(product, 1 / scores.length);

  return Math.round(geometricMean * BPS);
};

/**
 * Calculate maximum weight per component based on count
 * @param {number} components - Number of components/pools
 * @param {number} minMaxBp - Minimum maximum weight in BP
 * @param {number} diversificationFactorBp - Diversification factor in BP
 * @param {number} maxBp - Absolute maximum weight in BP
 * @returns {number} Maximum weight in BP
 */
export const componentMaxWeightBp = (components, minMaxBp, diversificationFactorBp, maxBp = BPS) => {
  const diversificationFactor = diversificationFactorBp / BPS;
  const decay = Math.exp(-components * diversificationFactor);
  const calculatedMax = minMaxBp + Math.round(decay * BPS);
  return Math.min(calculatedMax, maxBp);
};

/**
 * Calculate target weights from cScores
 * @param {number[]} cScores - Array of cScores (0-10000)
 * @param {number} maxWeightBp - Maximum weight per pool in BP
 * @param {number} totalWeightBp - Total weight to distribute in BP
 * @param {number} scoreAmplifierBp - Score amplification factor in BP
 * @returns {number[]} Array of weights in BP
 */
export const targetWeights = (cScores, maxWeightBp, totalWeightBp, scoreAmplifierBp) => {
  const n = cScores.length;
  if (n === 0) return [];

  const amplifier = scoreAmplifierBp / BPS;

  // Calculate raw weights using power function
  const rawWeights = cScores.map(score => {
    if (score === 0) return 0;
    return Math.pow(score / BPS, amplifier);
  });

  const totalRawWeight = rawWeights.reduce((sum, w) => sum + w, 0);
  if (totalRawWeight === 0) return new Array(n).fill(0);

  // Normalize to total weight
  let weights = rawWeights.map(w => (w / totalRawWeight) * totalWeightBp);

  // Apply capping with redistribution
  const maxWeight = (maxWeightBp / BPS) * totalWeightBp;

  for (let iteration = 0; iteration < 10; iteration++) {
    let totalExcess = 0;
    let cappedIndices = [];

    // Find excess and cap weights
    weights.forEach((weight, i) => {
      if (weight > maxWeight) {
        totalExcess += weight - maxWeight;
        weights[i] = maxWeight;
        cappedIndices.push(i);
      }
    });

    if (totalExcess === 0) break;

    // Redistribute excess to uncapped weights
    const uncappedIndices = [];
    let uncappedTotal = 0;

    weights.forEach((weight, i) => {
      if (!cappedIndices.includes(i) && weight < maxWeight) {
        uncappedIndices.push(i);
        uncappedTotal += weight;
      }
    });

    if (uncappedTotal === 0) break;

    // Proportionally redistribute
    uncappedIndices.forEach(i => {
      const proportion = weights[i] / uncappedTotal;
      weights[i] += totalExcess * proportion;
    });
  }

  // Round and ensure sum equals totalWeightBp
  weights = weights.map(w => Math.round(w));
  const sum = weights.reduce((s, w) => s + w, 0);
  const diff = totalWeightBp - sum;

  if (diff !== 0) {
    // Add difference to largest weight
    const maxIndex = weights.indexOf(Math.max(...weights));
    weights[maxIndex] += diff;
  }

  return weights;
};

/**
 * Calculate target allocations in absolute amounts
 * @param {number[]} cScores - Array of cScores
 * @param {number} amount - Total amount to allocate
 * @param {number} maxWeightBp - Maximum weight per pool in BP
 * @param {number} scoreAmplifierBp - Score amplification factor in BP
 * @returns {number[]} Array of allocations
 */
export const targetAllocations = (cScores, amount, maxWeightBp, scoreAmplifierBp) => {
  const weights = targetWeights(cScores, maxWeightBp, BPS, scoreAmplifierBp);
  return weights.map(weight => (amount * weight) / BPS);
};

// LIQUIDITY MODEL FUNCTIONS

/**
 * Calculate target liquidity ratio in BP
 * @param {number} tvlUsd - TVL in USD
 * @param {number} minRatioBp - Minimum ratio in BP
 * @param {number} tvlFactorBp - TVL factor in BP
 * @param {number} tvlExponentBp - TVL exponent in BP
 * @returns {number} Target liquidity ratio in BP
 */
export const targetLiquidityRatioBp = (tvlUsd, minRatioBp, tvlFactorBp, tvlExponentBp) => {
  if (minRatioBp >= BPS) return BPS;

  const minRatio = minRatioBp / BPS;
  const tvlFactor = tvlFactorBp / BPS;
  const tvlExponent = tvlExponentBp / BPS;

  // Use TVL directly without normalization, but scale it appropriately
  // Assuming TVL factor is meant to work with TVL in millions for reasonable values
  const scaledTvl = tvlUsd; // Convert to millions for factor calculation
  const decay = Math.pow(1 + scaledTvl * tvlFactor, -tvlExponent)
  const ratio = minRatio + (1 - minRatio) * decay;
  return Math.round(ratio * BPS);
};

/**
 * Calculate target liquidity amount
 * @param {number} tvlUsd - TVL in USD
 * @param {number} minRatioBp - Minimum ratio in BP
 * @param {number} tvlFactorBp - TVL factor in BP
 * @param {number} tvlExponentBp - TVL exponent in BP
 * @returns {number} Target liquidity amount
 */
export const targetLiquidityUsd = (tvlUsd, minRatioBp, tvlFactorBp, tvlExponentBp) => {
  const ratio = targetLiquidityRatioBp(tvlUsd, minRatioBp, tvlFactorBp, tvlExponentBp);
  return (tvlUsd * ratio) / BPS;
};

/**
 * Calculate liquidity trigger levels
 * @param {number} targetRatioBp - Target ratio in BP
 * @param {number} lowOffsetBp - Low offset in BP
 * @param {number} highOffsetBp - High offset in BP
 * @returns {object} Low and high trigger ratios in BP
 */
export const liquidityTriggers = (targetRatioBp, lowOffsetBp, highOffsetBp) => {
  const lowOffset = lowOffsetBp / BPS;
  const highOffset = highOffsetBp / BPS;

  return {
    lowTrigger: Math.round(targetRatioBp * (1 - lowOffset)),
    highTrigger: Math.round(targetRatioBp * (1 + highOffset)),
  };
};

// SLIPPAGE MODEL FUNCTIONS

/**
 * Calculate dynamic slippage based on ratioDiff0
 * @param {number} ratioDiff0Bp - Ratio difference in BP (-10000 to 10000)
 * @param {number} minSlippageBp - Minimum slippage in BP
 * @param {number} maxSlippageBp - Maximum slippage in BP
 * @param {number} amplificationBp - Amplification factor in BP (0-10000)
 * @returns {number} Slippage in BP
 */
export const calculateSlippage = (ratioDiff0Bp, minSlippageBp, maxSlippageBp, amplificationBp) => {
  // Normalize ratio difference to [0, 1] range
  const normalizedRatio = (ratioDiff0Bp + BPS) / (2 * BPS);

  // Calculate transformation exponent
  const amplificationDiff = Math.abs(amplificationBp - 5000);
  const exponent = Math.pow(10, amplificationDiff / 2500);

  // Apply transformation based on amplification
  let transformed;
  if (amplificationBp <= 5000) {
    // Concave curve (logarithmic-like)
    transformed = 1 - Math.pow(1 - normalizedRatio, exponent);
  } else {
    // Convex curve (exponential-like)
    transformed = Math.pow(normalizedRatio, exponent);
  }

  // Ensure transformed is in [0, 1]
  transformed = Math.max(0, Math.min(1, transformed));

  // Map to slippage range
  const slippage = maxSlippageBp + (minSlippageBp - maxSlippageBp) * transformed;

  // Bound result
  const minBound = Math.min(minSlippageBp, maxSlippageBp);
  const maxBound = Math.max(minSlippageBp, maxSlippageBp);

  return Math.max(minBound, Math.min(maxBound, Math.round(slippage)));
};

// HELPER FUNCTIONS FOR CHARTS

/**
 * Generate data points for liquidity curve
 * @param {object} model - Liquidity model parameters
 * @param {number} maxTvl - Maximum TVL for chart
 * @param {number} points - Number of data points
 * @param {boolean} useLogScale - Whether to use logarithmic scale (affects starting point)
 * @returns {object[]} Array of {tvl, target, low, high} data points
 */
export const generateLiquidityCurveData = (model, maxTvl = 100000000, points = 100, useLogScale = false) => {
  const data = [];
  const minTvl = useLogScale ? 1000 : 0; // Start from $1 for log scale, $0 for linear

  for (let i = 0; i <= points; i++) {
    let tvl;

    if (useLogScale) {
      // Logarithmic spacing for smooth log scale distribution
      const logMin = Math.log(minTvl);
      const logMax = Math.log(maxTvl);
      const logStep = (logMax - logMin) / points;
      tvl = Math.exp(logMin + i * logStep);
    } else {
      // Linear spacing for linear scale
      tvl = minTvl + (i / points) * (maxTvl - minTvl);
    }

    const target = targetLiquidityRatioBp(tvl, model.minRatioBp, model.tvlFactorBp, model.tvlExponentBp);
    const triggers = liquidityTriggers(target, model.lowOffsetBp, model.highOffsetBp);

    data.push({
      tvl,
      target: bpToPercent(target),
      low: bpToPercent(triggers.lowTrigger),
      high: bpToPercent(triggers.highTrigger),
    });
  }
  return data;
};

/**
 * Generate data points for slippage curve
 * @param {object} model - Slippage model parameters
 * @param {number} points - Number of data points
 * @returns {object[]} Array of {ratioDiff0, slippage} data points
 */
export const generateSlippageCurveData = (model, points = 200) => {
  const data = [];
  for (let i = 0; i <= points; i++) {
    const ratioDiff0Bp = -BPS + (i / points) * (2 * BPS);
    const slippage = calculateSlippage(ratioDiff0Bp, model.minSlippageBp, model.maxSlippageBp, model.amplificationBp);

    data.push({
      ratioDiff0: bpToPercent(ratioDiff0Bp),
      slippage: bpToPercent(slippage),
    });
  }
  return data;
};

/**
 * Generate data points for max weight curve
 * @param {object} model - Weight model parameters
 * @param {number} maxComponents - Maximum number of components
 * @returns {object[]} Array of {components, maxWeight} data points
 */
export const generateMaxWeightCurveData = (model, maxComponents = 20) => {
  const data = [];
  for (let components = 1; components <= maxComponents; components++) {
    const maxWeight = componentMaxWeightBp(components, model.minMaxBp, model.diversificationFactorBp, model.maxBp);
    data.push({
      components,
      maxWeight: bpToPercent(maxWeight),
    });
  }
  return data;
};
