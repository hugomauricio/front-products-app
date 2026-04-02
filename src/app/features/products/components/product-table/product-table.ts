import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialProduct } from '../../models/financial-product.model';
import { ProductActionsMenuComponent } from '../product-actions-menu/product-actions-menu';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, ProductActionsMenuComponent],
  templateUrl: './product-table.html',
  styleUrl: './product-table.scss'
})
export class ProductTableComponent {
  @Input() products: FinancialProduct[] = [];

  @Output() edit = new EventEmitter<FinancialProduct>();
  @Output() delete = new EventEmitter<FinancialProduct>();

  trackByProductId(index: number, product: FinancialProduct): string {
  return product.id;
}
}