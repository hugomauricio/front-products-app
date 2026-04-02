import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { ProductEditPageComponent } from './product-edit-page';
import { ProductsApiService } from '../../services/products-api';
import { NotificationService } from '../../../../core/services/notification';

describe('ProductEditPageComponent', () => {
  let component: ProductEditPageComponent;
  let fixture: ComponentFixture<ProductEditPageComponent>;
  let productsApiServiceSpy: jasmine.SpyObj<ProductsApiService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    productsApiServiceSpy = jasmine.createSpyObj('ProductsApiService', ['getProducts', 'updateProduct']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    productsApiServiceSpy.getProducts.and.returnValue(
      of([
        {
          id: 'uno',
          name: 'Cuenta Ahorros',
          description: 'Producto financiero válido',
          logo: 'logo.png',
          date_release: '2099-01-01',
          date_revision: '2100-01-01'
        }
      ])
    );

    await TestBed.configureTestingModule({
      imports: [ProductEditPageComponent],
      providers: [
        NotificationService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'uno'
              }
            }
          }
        },
        { provide: ProductsApiService, useValue: productsApiServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});