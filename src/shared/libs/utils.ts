export function round2(value: number | string | null | undefined): number {
  const num = Number(value ?? 0);
  return Math.round(num * 100) / 100;
}

export function formatMoney(value: number | string | null | undefined): string {
  const n = round2(value);
  return n.toFixed(2);
}

