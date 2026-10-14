export function calculateFinalPrice(
  originalPrice: number,
  exchangeRate: number,
  additionalCharges: number,
  marginPercentage: number
): number {
  const landedCost = originalPrice * exchangeRate + additionalCharges;
  const finalPrice = landedCost * (1 + marginPercentage / 100);
  return Math.round(finalPrice * 100) / 100;
}
