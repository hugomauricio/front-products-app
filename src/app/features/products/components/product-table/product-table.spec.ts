import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductTableComponent } from './product-table';
import { FinancialProduct } from '../../models/financial-product.model';

describe('ProductTableComponent', () => {
  let component: ProductTableComponent;
  let fixture: ComponentFixture<ProductTableComponent>;

  const mockProducts: FinancialProduct[] = [
    {
      id: 'uno',
      name: 'Cuenta Ahorros',
      description: 'Producto de ahorro',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductTableComponent);
    component = fixture.componentInstance;
    component.products = mockProducts;
    fixture.detectChanges();
  });

  it('debe renderizar productos', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Cuenta Ahorros');
    expect(compiled.textContent).toContain('Producto de ahorro');
  });

  it('debe emitir edit', () => {
    spyOn(component.edit, 'emit');
    component.edit.emit(mockProducts[0]);
    expect(component.edit.emit).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('debe emitir delete', () => {
    spyOn(component.delete, 'emit');
    component.delete.emit(mockProducts[0]);
    expect(component.delete.emit).toHaveBeenCalledWith(mockProducts[0]);
  });
});