export interface CalculationInput {
  accountBalance: number
  riskPercent: number
  currencyPair: string
  entryPrice: number
  stopLossPips: number
  leverage: number
  conversionRate?: number
  isShort: boolean
}

export interface CalculationResult {
  allowableLoss: number
  recommendedLot: number
  units: number
  pipValue: number
  requiredMargin: number
  tp1: number
  tp15: number
  tp2: number
}

const STANDARD_LOT = 100000

function getPipSize(currencyPair: string): number {
  return currencyPair.includes('JPY') ? 0.01 : 0.0001
}

function calculatePipValue(
  currencyPair: string,
  _entryPrice: number,
  conversionRate?: number
): number {
  const pipSize = getPipSize(currencyPair)
  const pipValueInQuoteCurrency = 1 * pipSize * STANDARD_LOT
  
  if (currencyPair.endsWith('JPY')) {
    return pipValueInQuoteCurrency
  }
  
  if (!conversionRate) {
    throw new Error('Conversion rate is required for non-JPY pairs')
  }
  
  return pipValueInQuoteCurrency * conversionRate
}

function calculateRecommendedLot(
  allowableLoss: number,
  pipValueJPY: number,
  stopLossPips: number
): number {
  const rawLot = allowableLoss / (pipValueJPY * stopLossPips)
  return Math.floor(rawLot * 100) / 100
}

function calculateRequiredMargin(
  currencyPair: string,
  entryPrice: number,
  lots: number,
  leverage: number,
  conversionRate?: number
): number {
  const units = lots * STANDARD_LOT
  let notionalValueJPY: number
  
  if (currencyPair.startsWith('JPY')) {
    notionalValueJPY = units / entryPrice
  } else if (currencyPair.endsWith('JPY')) {
    notionalValueJPY = units * entryPrice
  } else {
    if (!conversionRate) {
      throw new Error('Conversion rate is required for non-JPY pairs')
    }
    const baseCurrency = currencyPair.slice(0, 3)
    if (baseCurrency === 'USD' || baseCurrency === 'EUR' || baseCurrency === 'GBP') {
      notionalValueJPY = units * conversionRate
    } else {
      notionalValueJPY = units * entryPrice * conversionRate
    }
  }
  
  return notionalValueJPY / leverage
}

function calculateTakeProfitPrices(
  entryPrice: number,
  stopLossPips: number,
  currencyPair: string,
  isShort: boolean
): { tp1: number; tp15: number; tp2: number } {
  const pipSize = getPipSize(currencyPair)
  const direction = isShort ? -1 : 1
  
  const tp1 = entryPrice + (direction * pipSize * stopLossPips * 1.0)
  const tp15 = entryPrice + (direction * pipSize * stopLossPips * 1.5)
  const tp2 = entryPrice + (direction * pipSize * stopLossPips * 2.0)
  
  return { tp1, tp15, tp2 }
}

export function calculate(input: CalculationInput): CalculationResult {
  const {
    accountBalance,
    riskPercent,
    currencyPair,
    entryPrice,
    stopLossPips,
    leverage,
    conversionRate,
    isShort
  } = input

  const allowableLoss = accountBalance * (riskPercent / 100)
  
  const pipValueJPY = calculatePipValue(currencyPair, entryPrice, conversionRate)
  
  const recommendedLot = calculateRecommendedLot(allowableLoss, pipValueJPY, stopLossPips)
  
  const units = recommendedLot * STANDARD_LOT
  
  const requiredMargin = calculateRequiredMargin(
    currencyPair,
    entryPrice,
    recommendedLot,
    leverage,
    conversionRate
  )
  
  const { tp1, tp15, tp2 } = calculateTakeProfitPrices(
    entryPrice,
    stopLossPips,
    currencyPair,
    isShort
  )
  
  return {
    allowableLoss,
    recommendedLot,
    units,
    pipValue: pipValueJPY,
    requiredMargin,
    tp1,
    tp15,
    tp2
  }
}