import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { ProductListPageComponent } from './product-list-page';
import { ProductsApiService } from '../../services/products-api';
import { NotificationService } from '../../../../core/services/notification';
import { FinancialProduct } from '../../models/financial-product.model';

describe('ProductListPageComponent', () => {
  let component: ProductListPageComponent;
  let fixture: ComponentFixture<ProductListPageComponent>;
  let productsApiServiceSpy: jasmine.SpyObj<ProductsApiService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockProducts: FinancialProduct[] = [
    {
      id: 'uno',
      name: 'Cuenta Ahorros',
      description: 'Producto de ahorro',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    },
    {
      id: 'dos',
      name: 'Tarjeta Oro',
      description: 'Producto de crédito',
      logo: 'logo2.png',
      date_release: '2025-02-01',
      date_revision: '2026-02-01'
    }
  ];

  beforeEach(async () => {
    productsApiServiceSpy = jasmine.createSpyObj('ProductsApiService', ['getProducts', 'deleteProduct']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    productsApiServiceSpy.getProducts.and.returnValue(of(mockProducts));
    productsApiServiceSpy.deleteProduct.and.returnValue(of({ message: 'ok' }));

    await TestBed.configureTestingModule({
      imports: [ProductListPageComponent],
      providers: [
        NotificationService,
        { provide: ProductsApiService, useValue: productsApiServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe cargar productos al iniciar', () => {
    expect(component.products.length).toBe(2);
    expect(component.filteredProducts.length).toBe(2);
  });

  it('debe filtrar productos por texto', () => {
    component.onSearch('ahorros');
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Cuenta Ahorros');
  });

  it('debe navegar a crear', () => {
    component.goToCreate();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products/new']);
  });

  it('debe navegar a editar', () => {
    component.onEdit(mockProducts[0]);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products', 'uno', 'edit']);
  });

  it('debe abrir modal de eliminación', () => {
    component.onDelete(mockProducts[0]);
    expect(component.isDeleteModalOpen).toBeTrue();
    expect(component.selectedProduct?.id).toBe('uno');
  });

  it('debe eliminar producto confirmado', () => {
    component.onDelete(mockProducts[0]);
    component.confirmDelete();

    expect(productsApiServiceSpy.deleteProduct).toHaveBeenCalledWith('uno');
    expect(component.products.length).toBe(1);
    expect(component.selectedProduct).toBeNull();
    expect(component.isDeleteModalOpen).toBeFalse();
  });
});