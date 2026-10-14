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

export interface SareeInput {
  name: string;
  description: string;
  imageUrl: string;
  originalPrice: number;
  exchangeRate: number;
  additionalCharges: number;
  marginPercentage: number;
}
