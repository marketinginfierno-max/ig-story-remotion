export function formatCompactNumber(value: number): string {
  if (Math.abs(value) < 10000) {
    return new Intl.NumberFormat("es").format(Math.round(value));
  }
  return new Intl.NumberFormat("es", { notation: "compact", maximumFractionDigits: 1 }).format(
    value
  );
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es").format(value);
}

export function formatPercent(value: number): string {
  return `${new Intl.NumberFormat("es", { maximumFractionDigits: 1 }).format(value)}%`;
}
