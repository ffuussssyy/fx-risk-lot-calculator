// 0.01 lot刻みの切り下げ（0.01 = 1ステップ）
// 0.01 lot = 1,000 units なので「100倍→floor→100で割る」より、
// 「100倍の整数＝ステップ数」を持つのが堅牢。
const LOT_STEP_MULTIPLIER = 100;      // 1.00 lot → 100 steps
const UNITS_PER_LOT = 100_000;        // 1 lot = 100,000 units
const UNITS_PER_STEP = UNITS_PER_LOT / LOT_STEP_MULTIPLIER; // 1 step = 1,000 units

export function toLotSteps(lotsRaw: number): number {
  // 例）0.2222 lot → 22 steps
  return Math.floor(lotsRaw * LOT_STEP_MULTIPLIER);
}

export function fromLotSteps(steps: number): number {
  // 例）22 steps → 0.22 lot
  return steps / LOT_STEP_MULTIPLIER;
}

export function calculateLotAndUnits(riskAmountJPY: number, pipValuePerLotJPY: number, stopPips: number): {
  lotsRaw: number;
  lotsRounded: number;
  units: number;
  lotSteps: number;
} {
  // 既存の計算
  const lotsRaw = riskAmountJPY / (pipValuePerLotJPY * stopPips);
  
  // ★ここを整数ステップで確定
  const lotSteps = toLotSteps(lotsRaw);        // 切り下げ（0.01刻み）
  const lotsRounded = fromLotSteps(lotSteps);  // 表示用 lots（小数2桁）
  const units = lotSteps * UNITS_PER_STEP;     // 1step = 1,000units なので誤差ゼロ
  
  return {
    lotsRaw,
    lotsRounded,
    units,
    lotSteps
  };
}

export function formatLots(lots: number): string {
  return lots.toFixed(2); // "0.22" など
}

// 定数をエクスポート
export { LOT_STEP_MULTIPLIER, UNITS_PER_LOT, UNITS_PER_STEP };