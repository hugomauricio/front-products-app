import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { FinancialProduct } from '../../models/financial-product.model';
import { ProductsApiService } from '../../services/products-api';
import { NotificationService } from '../../../../core/services/notification';
import { ProductTableComponent } from '../../components/product-table/product-table';
import { DeleteConfirmModalComponent } from '../../components/delete-confirm-modal/delete-confirm-modal';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductTableComponent, DeleteConfirmModalComponent],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.scss'
})
export class ProductListPageComponent implements OnInit {
  products: FinancialProduct[] = [];
  filteredProducts: FinancialProduct[] = [];
  visibleProducts: FinancialProduct[] = [];

  searchTerm = '';
  pageSize = 5;
  isLoading = false;
  errorMessage = '';

  isDeleteModalOpen = false;
  isDeleting = false;
  selectedProduct: FinancialProduct | null = null;

  constructor(
    private readonly productsApiService: ProductsApiService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.notificationService.clear();

    this.productsApiService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage =
          this.notificationService.getMessage() ||
          'No se pudieron cargar los productos.';
        this.isLoading = false;
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.applyFilters();
  }

  goToCreate(): void {
    this.router.navigate(['/products/new']);
  }

  onEdit(product: FinancialProduct): void {
    this.router.navigate(['/products', product.id, 'edit']);
  }

  onDelete(product: FinancialProduct): void {
    this.selectedProduct = product;
    this.isDeleteModalOpen = true;
  }

closeDeleteModal(): void {
  if (this.isDeleting) {
    return;
  }

  this.isDeleteModalOpen = false;
  this.selectedProduct = null;
}

confirmDelete(): void {
  if (!this.selectedProduct) {
    return;
  }

  this.isDeleting = true;
  this.errorMessage = '';
  this.notificationService.clear();

  this.productsApiService.deleteProduct(this.selectedProduct.id).subscribe({
    next: () => {
      this.products = this.products.filter(
        (product) => product.id !== this.selectedProduct?.id
      );
      this.applyFilters();
      this.isDeleting = false;
      this.isDeleteModalOpen = false;
      this.selectedProduct = null;
    },
    error: () => {
      this.errorMessage =
        this.notificationService.getMessage() ||
        'No se pudo eliminar el producto.';
      this.isDeleting = false;
    }
  });
}

  private applyFilters(): void {
    const normalizedTerm = this.searchTerm.trim().toLowerCase();

    this.filteredProducts = this.products.filter((product) => {
      return (
        product.id.toLowerCase().includes(normalizedTerm) ||
        product.name.toLowerCase().includes(normalizedTerm) ||
        product.description.toLowerCase().includes(normalizedTerm)
      );
    });

    this.visibleProducts = this.filteredProducts.slice(0, this.pageSize);
  }
}