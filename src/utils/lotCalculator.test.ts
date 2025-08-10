import { describe, it, expect } from 'vitest'
import { toLotSteps, fromLotSteps, calculateLotAndUnits, formatLots } from './lotCalculator'

describe('Lot Calculator Utilities', () => {
  it('should convert lots to steps correctly', () => {
    expect(toLotSteps(0.2222)).toBe(22) // 0.2222 lot → 22 steps (切り下げ)
    expect(toLotSteps(0.334)).toBe(33)  // 0.334 lot → 33 steps (切り下げ)
    expect(toLotSteps(0.009)).toBe(0)   // 0.009 lot → 0 steps (切り下げ)
    expect(toLotSteps(1.0)).toBe(100)   // 1.0 lot → 100 steps
    expect(toLotSteps(0.01)).toBe(1)    // 0.01 lot → 1 step
  })

  it('should convert steps to lots correctly', () => {
    expect(fromLotSteps(22)).toBe(0.22)  // 22 steps → 0.22 lot
    expect(fromLotSteps(33)).toBe(0.33)  // 33 steps → 0.33 lot
    expect(fromLotSteps(0)).toBe(0.00)   // 0 steps → 0.00 lot
    expect(fromLotSteps(100)).toBe(1.00) // 100 steps → 1.00 lot
    expect(fromLotSteps(1)).toBe(0.01)   // 1 step → 0.01 lot
  })

  it('should calculate lot and units with proper rounding', () => {
    const riskAmountJPY = 20000
    const pipValuePerLotJPY = 1000
    const stopPips = 20
    
    const result = calculateLotAndUnits(riskAmountJPY, pipValuePerLotJPY, stopPips)
    
    // 20000 / (1000 * 20) = 1.0 lot (raw)
    expect(result.lotsRaw).toBe(1.0)
    expect(result.lotsRounded).toBe(1.0)  // 100 steps → 1.00 lot
    expect(result.units).toBe(100000)     // 100 steps * 1000 units/step
    expect(result.lotSteps).toBe(100)
  })

  it('should handle fractional lots with cutting down', () => {
    const riskAmountJPY = 22220
    const pipValuePerLotJPY = 1000  
    const stopPips = 100
    
    const result = calculateLotAndUnits(riskAmountJPY, pipValuePerLotJPY, stopPips)
    
    // 22220 / (1000 * 100) = 0.2222 lot (raw)
    expect(result.lotsRaw).toBe(0.2222)
    expect(result.lotsRounded).toBe(0.22) // 22 steps → 0.22 lot (切り下げ)
    expect(result.units).toBe(22000)      // 22 steps * 1000 units/step
    expect(result.lotSteps).toBe(22)
  })

  it('should handle very small lots (below 0.01)', () => {
    const riskAmountJPY = 500
    const pipValuePerLotJPY = 1000
    const stopPips = 100
    
    const result = calculateLotAndUnits(riskAmountJPY, pipValuePerLotJPY, stopPips)
    
    // 500 / (1000 * 100) = 0.005 lot (raw)
    expect(result.lotsRaw).toBe(0.005)
    expect(result.lotsRounded).toBe(0.00) // 0 steps → 0.00 lot (切り下げ)
    expect(result.units).toBe(0)          // 0 steps * 1000 units/step
    expect(result.lotSteps).toBe(0)
  })

  it('should format lots to 2 decimal places', () => {
    expect(formatLots(0.22)).toBe('0.22')
    expect(formatLots(1.0)).toBe('1.00')
    expect(formatLots(0.009)).toBe('0.01') // 注意：formatLotsは単純なtoFixed
  })
})