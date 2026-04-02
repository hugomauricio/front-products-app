import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FinancialProduct } from '../models/financial-product.model';
import { ProductListResponse } from '../models/product-list-response.model';
import { ProductResponse } from '../models/product-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}/bp/products`;

  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<FinancialProduct[]> {
    return this.http
      .get<ProductListResponse>(this.baseUrl)
      .pipe(map(response => response.data));
  }

  verifyProductId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${id}`);
  }

  createProduct(payload: FinancialProduct): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.baseUrl, payload);
  }

  updateProduct(
    id: string,
    payload: Omit<FinancialProduct, 'id'>
  ): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.baseUrl}/${id}`, payload);
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}