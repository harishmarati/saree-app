/**
 * Final price (AUD) = ((original price in INR + additional charges in INR) / exchange rate)
 * marked up by the percentage margin. Exchange rate is INR per 1 AUD.
 */
export function calculateFinalPrice(
  originalPrice: number,
  exchangeRate: number,
  additionalCharges: number,
  marginPercentage: number
): number {
  if (!exchangeRate) return 0;
  const landedCost = (originalPrice + additionalCharges) / exchangeRate;
  const finalPrice = landedCost * (1 + marginPercentage / 100);
  return Math.round(finalPrice * 100) / 100;
}
