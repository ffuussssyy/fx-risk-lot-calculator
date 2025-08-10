/**
 * 通貨ペアに応じた価格フォーマット
 * JPYを含むペア: 小数3桁
 * その他: 小数5桁
 */
export function formatPrice(pair: string, price: number): string {
  const isJpyPair = pair.includes('JPY')
  return price.toFixed(isJpyPair ? 3 : 5)
}

/**
 * 金額をJPY表記でフォーマット
 */
export function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString()}`
}

/**
 * ロット数を2桁固定でフォーマット
 */
export function formatLot(lots: number): string {
  return lots.toFixed(2)
}