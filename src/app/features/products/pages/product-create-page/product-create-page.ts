import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ProductFormComponent } from '../../components/product-form/product-form';
import { FinancialProduct } from '../../models/financial-product.model';
import { ProductsApiService } from '../../services/products-api';
import { NotificationService } from '../../../../core/services/notification';

@Component({
  selector: 'app-product-create-page',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './product-create-page.html',
  styleUrl: './product-create-page.scss'
})
export class ProductCreatePageComponent {
  private readonly productsApiService = inject(ProductsApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  loading = false;
  errorMessage = '';

  onSubmit(product: FinancialProduct): void {
    this.loading = true;
    this.errorMessage = '';
    this.notificationService.clear();

    this.productsApiService.createProduct(product).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: () => {
        this.errorMessage =
          this.notificationService.getMessage() ||
          'No se pudo crear el producto.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}