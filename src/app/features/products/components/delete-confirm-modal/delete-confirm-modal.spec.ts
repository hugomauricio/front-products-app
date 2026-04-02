import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteConfirmModalComponent } from './delete-confirm-modal';

describe('DeleteConfirmModalComponent', () => {
  let component: DeleteConfirmModalComponent;
  let fixture: ComponentFixture<DeleteConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteConfirmModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe emitir cancel cuando no está cargando', () => {
    spyOn(component.cancel, 'emit');

    component.loading = false;
    component.onCancel();

    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('no debe emitir cancel cuando está cargando', () => {
    spyOn(component.cancel, 'emit');

    component.loading = true;
    component.onCancel();

    expect(component.cancel.emit).not.toHaveBeenCalled();
  });

  it('debe emitir confirm cuando no está cargando', () => {
    spyOn(component.confirm, 'emit');

    component.loading = false;
    component.onConfirm();

    expect(component.confirm.emit).toHaveBeenCalled();
  });
});