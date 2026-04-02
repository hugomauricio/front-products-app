import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-actions-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-actions-menu.html',
  styleUrl: './product-actions-menu.scss'
})
export class ProductActionsMenuComponent {
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  isOpen = false;

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  onEdit(): void {
    this.edit.emit();
    this.isOpen = false;
  }

  onDelete(): void {
    this.delete.emit();
    this.isOpen = false;
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.isOpen = false;
  }
}