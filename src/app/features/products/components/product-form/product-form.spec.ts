import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProductFormComponent } from './product-form';
import { ProductsApiService } from '../../services/products-api';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productsApiServiceSpy: jasmine.SpyObj<ProductsApiService>;

  beforeEach(async () => {
    productsApiServiceSpy = jasmine.createSpyObj('ProductsApiService', ['verifyProductId']);
    productsApiServiceSpy.verifyProductId.and.returnValue(of(false));

    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [
        { provide: ProductsApiService, useValue: productsApiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el formulario', () => {
    expect(component.form).toBeTruthy();
  });

  it('debe marcar required en id', () => {
    const control = component.form.get('id');
    control?.setValue('');
    control?.markAsTouched();

    expect(control?.hasError('required')).toBeTrue();
  });

  it('debe invalidar nombre con menos de 5 caracteres', () => {
    const control = component.form.get('name');
    control?.setValue('abc');

    expect(control?.hasError('minlength')).toBeTrue();
  });

  it('debe deshabilitar id en modo edit', () => {
    component.mode = 'edit';
    component.initialValue = {
      id: 'uno',
      name: 'Cuenta Ahorros',
      description: 'Producto financiero válido',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    };

    component.ngOnInit();

    expect(component.form.get('id')?.disabled).toBeTrue();
  });

  it('debe emitir submit cuando el formulario es válido', () => {
    spyOn(component.formSubmit, 'emit');

    component.form.patchValue({
      id: 'prod1',
      name: 'Cuenta Ahorros',
      description: 'Producto financiero válido',
      logo: 'logo.png',
      date_release: '2099-01-01',
      date_revision: '2100-01-01'
    });

    component.onSubmit();

    expect(component.formSubmit.emit).toHaveBeenCalled();
  });
});