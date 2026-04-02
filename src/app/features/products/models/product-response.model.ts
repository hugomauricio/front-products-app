import { FinancialProduct } from './financial-product.model';

export interface ProductResponse {
  message: string;
  data: FinancialProduct;
}