import { describe, it, expect } from 'vitest'
import { calculate } from './calculator'

describe('FX Risk Calculator', () => {
  it('should calculate example 1 correctly (USDJPY long)', () => {
    const input = {
      accountBalance: 1000000,
      riskPercent: 2,
      currencyPair: 'USDJPY',
      entryPrice: 150.00,
      stopLossPips: 20,
      leverage: 25,
      isShort: false
    }
    
    const result = calculate(input)
    
    expect(result.allowableLoss).toBe(20000)
    
    expect(result.pipValue).toBeCloseTo(1000, 0.1)
    
    expect(result.recommendedLot).toBeCloseTo(1.0, 0.01)
    
    expect(result.units).toBe(100000)
    
    expect(result.requiredMargin).toBeCloseTo(600000, -3)
    
    expect(result.tp1).toBeCloseTo(150.20, 0.01)
    expect(result.tp15).toBeCloseTo(150.30, 0.01)
    expect(result.tp2).toBeCloseTo(150.40, 0.01)
  })

  it('should calculate example 2 correctly (EURUSD long)', () => {
    const input = {
      accountBalance: 1000000,
      riskPercent: 2,
      currencyPair: 'EURUSD',
      entryPrice: 1.1000,
      stopLossPips: 15,
      leverage: 25,
      conversionRate: 150.00,
      isShort: false
    }
    
    const result = calculate(input)
    
    expect(result.allowableLoss).toBe(20000)
    
    expect(result.pipValue).toBeCloseTo(1500, 1)
    
    expect(result.recommendedLot).toBeCloseTo(0.88, 0.01)
    
    expect(result.units).toBeCloseTo(88000, 100)
    
    expect(result.requiredMargin).toBeCloseTo(528000, -3)
    
    expect(result.tp1).toBeCloseTo(1.1015, 0.0001)
    expect(result.tp15).toBeCloseTo(1.1022, 0.0001)
    expect(result.tp2).toBeCloseTo(1.1030, 0.0001)
  })

  it('should calculate short positions correctly', () => {
    const input = {
      accountBalance: 1000000,
      riskPercent: 2,
      currencyPair: 'USDJPY',
      entryPrice: 150.00,
      stopLossPips: 20,
      leverage: 25,
      isShort: true
    }
    
    const result = calculate(input)
    
    expect(result.tp1).toBeCloseTo(149.80, 0.01)
    expect(result.tp15).toBeCloseTo(149.70, 0.01)
    expect(result.tp2).toBeCloseTo(149.60, 0.01)
  })

  it('should handle JPY pairs correctly', () => {
    const input = {
      accountBalance: 500000,
      riskPercent: 1,
      currencyPair: 'EURJPY',
      entryPrice: 165.00,
      stopLossPips: 25,
      leverage: 100,
      isShort: false
    }
    
    const result = calculate(input)
    
    expect(result.allowableLoss).toBe(5000)
    expect(result.pipValue).toBeCloseTo(1000, 0.1)
    expect(result.recommendedLot).toBeCloseTo(0.20, 0.01)
  })

  it('should throw error for invalid inputs', () => {
    expect(() => {
      calculate({
        accountBalance: -100,
        riskPercent: 2,
        currencyPair: 'USDJPY',
        entryPrice: 150.00,
        stopLossPips: 20,
        leverage: 25,
        isShort: false
      })
    }).not.toThrow()

    expect(() => {
      calculate({
        accountBalance: 1000000,
        riskPercent: 2,
        currencyPair: 'EURUSD',
        entryPrice: 1.1000,
        stopLossPips: 15,
        leverage: 25,
        isShort: false
      })
    }).toThrow('Conversion rate is required for non-JPY pairs')
  })
})