const UNITS_PER_LOT = 100_000 as const;

// "USDJPY" などからクオート通貨を取り出す簡易関数
export const baseCcy = (pair: string) => pair.slice(0, 3);
export const quoteCcy = (pair: string) => pair.slice(3, 6);

/**
 * 口座通貨=JPY想定の名目額（JPY）
 * pair: 例 "USDJPY" / "EURUSD" / "EURGBP" など
 * units: 取引数量（例: 22000）
 * entryPrice: 通貨ペアの価格（例: EURUSD=1.1000, USDJPY=150.00）
 * convToJPY: クオート通貨→JPYの換算レート（例: USDJPY=150, GBPJPY=190 など）
 *   - quoteがJPYのときは無視
 */
export function notionalInJPY(pair: string, units: number, entryPrice: number, convToJPY?: number): number {
  const quote = quoteCcy(pair);

  // クオート通貨がJPY（USDJPY, EURJPY, GBPJPYなど）
  if (quote === 'JPY') {
    // 1単位あたり entryPrice [JPY] なので、そのまま掛ければOK
    return units * entryPrice;
  }

  // クオート通貨がJPY以外（EURUSD, EURGBPなど）
  // → クオート通貨→JPYの換算が必須（例：USDJPY, GBPJPY）
  if (!convToJPY || convToJPY <= 0) {
    throw new Error('クロスペアは「クオート/JPY」の換算レートが必要です');
  }
  // 名目額 = units × (entryPrice [quote]) × (quote→JPY)
  return units * entryPrice * convToJPY;
}

/**
 * 必要証拠金計算（JPY）
 */
export function calculateMarginJPY(
  pair: string,
  units: number,
  entryPrice: number,
  leverage: number,
  convToJPY?: number
): number {
  const notionalJPY = notionalInJPY(pair, units, entryPrice, convToJPY);
  return notionalJPY / leverage;
}

export { UNITS_PER_LOT };