import { describe, it, expect } from 'vitest'
import { baseCcy, quoteCcy, notionalInJPY, calculateMarginJPY } from './notionalCalculator'

describe('Notional Calculator', () => {
  it('should extract base and quote currencies correctly', () => {
    expect(baseCcy('USDJPY')).toBe('USD')
    expect(quoteCcy('USDJPY')).toBe('JPY')
    
    expect(baseCcy('EURUSD')).toBe('EUR')
    expect(quoteCcy('EURUSD')).toBe('USD')
    
    expect(baseCcy('GBPAUD')).toBe('GBP')
    expect(quoteCcy('GBPAUD')).toBe('AUD')
  })

  it('should calculate notional for JPY pairs correctly', () => {
    // USDJPY: 100,000 units at 150.00 JPY per USD
    const notional1 = notionalInJPY('USDJPY', 100000, 150.00)
    expect(notional1).toBe(15000000) // 100,000 * 150.00 = 15,000,000 JPY

    // EURJPY: 22,000 units at 165.00 JPY per EUR  
    const notional2 = notionalInJPY('EURJPY', 22000, 165.00)
    expect(notional2).toBe(3630000) // 22,000 * 165.00 = 3,630,000 JPY
  })

  it('should calculate notional for cross pairs correctly', () => {
    // EURUSD: 88,000 units at 1.1000 EUR/USD, USD/JPY = 150.00
    const notional1 = notionalInJPY('EURUSD', 88000, 1.1000, 150.00)
    expect(notional1).toBeCloseTo(14520000, -1) // 88,000 * 1.1000 * 150.00 = 14,520,000 JPY

    // GBPAUD: 50,000 units at 1.9000 GBP/AUD, AUD/JPY = 100.00
    const notional2 = notionalInJPY('GBPAUD', 50000, 1.9000, 100.00)
    expect(notional2).toBeCloseTo(9500000, -1) // 50,000 * 1.9000 * 100.00 = 9,500,000 JPY
  })

  it('should throw error for cross pairs without conversion rate', () => {
    expect(() => {
      notionalInJPY('EURUSD', 100000, 1.1000)
    }).toThrow('クロスペアは「クオート/JPY」の換算レートが必要です')

    expect(() => {
      notionalInJPY('GBPAUD', 50000, 1.9000, 0)
    }).toThrow('クロスペアは「クオート/JPY」の換算レートが必要です')
  })

  it('should calculate margin correctly', () => {
    // USDJPY: 100,000 units at 150.00, leverage 25
    const margin1 = calculateMarginJPY('USDJPY', 100000, 150.00, 25)
    expect(margin1).toBeCloseTo(600000, -2) // 15,000,000 / 25 = 600,000 JPY

    // EURUSD: 88,000 units at 1.1000, USD/JPY = 150.00, leverage 25
    const margin2 = calculateMarginJPY('EURUSD', 88000, 1.1000, 25, 150.00)
    expect(margin2).toBeCloseTo(580800, -2) // 14,520,000 / 25 = 580,800 JPY
  })

  it('should handle edge cases', () => {
    // Zero units
    const notional1 = notionalInJPY('USDJPY', 0, 150.00)
    expect(notional1).toBe(0)

    // Very small amounts
    const notional2 = notionalInJPY('EURJPY', 1000, 165.50)
    expect(notional2).toBe(165500) // 1,000 * 165.50 = 165,500 JPY
  })
})