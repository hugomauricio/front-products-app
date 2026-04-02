import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-confirm-modal.html',
  styleUrl: './delete-confirm-modal.scss'
})
export class DeleteConfirmModalComponent {
  @Input() isOpen = false;
  @Input() productName = '';
  @Input() loading = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onCancel(): void {
    if (this.loading) {
      return;
    }

    this.cancel.emit();
  }

  onConfirm(): void {
    if (this.loading) {
      return;
    }

    this.confirm.emit();
  }
}