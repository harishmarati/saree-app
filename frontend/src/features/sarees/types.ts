export interface Saree {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  originalPrice: number;
  exchangeRate: number;
  additionalCharges: number;
  marginPercentage: number;
  finalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export type SareeInput = Omit<Saree, 'id' | 'finalPrice' | 'createdAt' | 'updatedAt'>;
