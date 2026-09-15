export function formatCurrency(amountInPaiseOrRupees: number): string {
  return `₹${amountInPaiseOrRupees.toFixed(2)}`;
}
