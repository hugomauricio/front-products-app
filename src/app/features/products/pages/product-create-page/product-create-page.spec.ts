import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { ProductCreatePageComponent } from './product-create-page';
import { ProductsApiService } from '../../services/products-api';
import { NotificationService } from '../../../../core/services/notification';

describe('ProductCreatePageComponent', () => {
  let component: ProductCreatePageComponent;
  let fixture: ComponentFixture<ProductCreatePageComponent>;
  let productsApiServiceSpy: jasmine.SpyObj<ProductsApiService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let notificationService: NotificationService;

  const mockProduct = {
    id: 'uno',
    name: 'Cuenta Ahorros',
    description: 'Producto financiero válido',
    logo: 'logo.png',
    date_release: '2099-01-01',
    date_revision: '2100-01-01'
  };

  beforeEach(async () => {
    productsApiServiceSpy = jasmine.createSpyObj('ProductsApiService', ['createProduct']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    productsApiServiceSpy.createProduct.and.returnValue(
      of({
        message: 'Product added successfully',
        data: mockProduct
      })
    );

    await TestBed.configureTestingModule({
      imports: [ProductCreatePageComponent],
      providers: [
        NotificationService,
        { provide: ProductsApiService, useValue: productsApiServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCreatePageComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe iniciar con loading en false y errorMessage vacío', () => {
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('');
  });

  it('debe crear producto y navegar al listado cuando el submit es exitoso', () => {
    spyOn(notificationService, 'clear').and.callThrough();

    component.onSubmit(mockProduct);

    expect(notificationService.clear).toHaveBeenCalled();
    expect(productsApiServiceSpy.createProduct).toHaveBeenCalledWith(mockProduct);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products']);
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('');
  });

  it('debe limpiar errorMessage antes de enviar', () => {
    component.errorMessage = 'Error anterior';

    component.onSubmit(mockProduct);

    expect(component.errorMessage).toBe('');
  });

  it('debe colocar loading en true al iniciar el submit', () => {
    productsApiServiceSpy.createProduct.and.returnValue(
      new Observable((subscriber) => {
        expect(component.loading).toBeTrue();
        subscriber.next({
          message: 'Product added successfully',
          data: mockProduct
        });
        subscriber.complete();
      })
    );

    component.onSubmit(mockProduct);

    expect(component.loading).toBeFalse();
  });

  it('debe mostrar mensaje del NotificationService si ocurre error', () => {
    spyOn(notificationService, 'clear').and.callThrough();
    spyOn(notificationService, 'getMessage').and.returnValue('Error controlado');

    productsApiServiceSpy.createProduct.and.returnValue(
      new Observable((subscriber) => {
        subscriber.error(new Error('fail'));
      })
    );

    component.onSubmit(mockProduct);

    expect(notificationService.clear).toHaveBeenCalled();
    expect(notificationService.getMessage).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Error controlado');
    expect(component.loading).toBeFalse();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('debe mostrar mensaje por defecto si NotificationService no devuelve mensaje', () => {
    spyOn(notificationService, 'getMessage').and.returnValue('');

    productsApiServiceSpy.createProduct.and.returnValue(
      new Observable((subscriber) => {
        subscriber.error(new Error('fail'));
      })
    );

    component.onSubmit(mockProduct);

    expect(component.errorMessage).toBe('No se pudo crear el producto.');
    expect(component.loading).toBeFalse();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('no debe dejar loading en true después de completar exitosamente', () => {
    component.loading = false;

    component.onSubmit(mockProduct);

    expect(component.loading).toBeFalse();
  });
});