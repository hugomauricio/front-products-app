import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductFormComponent } from '../../components/product-form/product-form';
import { FinancialProduct } from '../../models/financial-product.model';
import { ProductsApiService } from '../../services/products-api';
import { NotificationService } from '../../../../core/services/notification';

@Component({
  selector: 'app-product-edit-page',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './product-edit-page.html',
  styleUrl: './product-edit-page.scss'
})
export class ProductEditPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsApiService = inject(ProductsApiService);
  private readonly notificationService = inject(NotificationService);

  loading = false;
  isLoadingProduct = false;
  errorMessage = '';
  product: FinancialProduct | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/products']);
      return;
    }

    this.loadProduct(id);
  }

  private loadProduct(id: string): void {
    this.isLoadingProduct = true;
    this.errorMessage = '';

    this.productsApiService.getProducts().subscribe({
      next: (products) => {
        const product = products.find((item) => item.id === id) || null;

        if (!product) {
          this.errorMessage = 'No se encontró el producto a editar.';
          this.isLoadingProduct = false;
          return;
        }

        this.product = product;
        this.isLoadingProduct = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar la información del producto.';
        this.isLoadingProduct = false;
      }
    });
  }

  onSubmit(product: FinancialProduct): void {
    if (!this.product) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.notificationService.clear();

    const payload = {
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: product.date_release,
      date_revision: product.date_revision
    };

    this.productsApiService.updateProduct(this.product.id, payload).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: () => {
        this.errorMessage =
          this.notificationService.getMessage() ||
          'No se pudo actualizar el producto.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}