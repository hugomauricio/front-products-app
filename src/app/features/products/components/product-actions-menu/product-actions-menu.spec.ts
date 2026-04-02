import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductActionsMenuComponent } from './product-actions-menu';

describe('ProductActionsMenuComponent', () => {
  let component: ProductActionsMenuComponent;
  let fixture: ComponentFixture<ProductActionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductActionsMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductActionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe abrir y cerrar el menú', () => {
    component.toggleMenu(new MouseEvent('click'));
    expect(component.isOpen).toBeTrue();

    component.closeMenu();
    expect(component.isOpen).toBeFalse();
  });

  it('debe emitir edit', () => {
    spyOn(component.edit, 'emit');

    component.onEdit();

    expect(component.edit.emit).toHaveBeenCalled();
    expect(component.isOpen).toBeFalse();
  });

  it('debe emitir delete', () => {
    spyOn(component.delete, 'emit');

    component.onDelete();

    expect(component.delete.emit).toHaveBeenCalled();
    expect(component.isOpen).toBeFalse();
  });
});