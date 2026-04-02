import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { ProductsApiService } from './products-api';
import { environment } from '../../../../environments/environment';

describe('ProductsApiService', () => {
  let service: ProductsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductsApiService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ProductsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe obtener productos', () => {
    const mockResponse = {
      data: [
        {
          id: 'uno',
          name: 'Cuenta Ahorros',
          description: 'Producto de ahorro',
          logo: 'logo.png',
          date_release: '2025-01-01',
          date_revision: '2026-01-01'
        }
      ]
    };

    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products[0].id).toBe('uno');
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/bp/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debe verificar si el id existe', () => {
    service.verifyProductId('uno').subscribe((exists) => {
      expect(exists).toBeTrue();
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/bp/products/verification/uno`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('debe eliminar un producto', () => {
    service.deleteProduct('uno').subscribe((response) => {
      expect(response.message).toBe('Product removed successfully');
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/bp/products/uno`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Product removed successfully' });
  });
});