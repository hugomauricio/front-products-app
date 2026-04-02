import { Routes } from '@angular/router';
import { ProductListPageComponent } from './features/products/pages/product-list-page/product-list-page';
import { ProductCreatePageComponent } from './features/products/pages/product-create-page/product-create-page';
import { ProductEditPageComponent } from './features/products/pages/product-edit-page/product-edit-page';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductListPageComponent },
  { path: 'products/new', component: ProductCreatePageComponent },
  { path: 'products/:id/edit', component: ProductEditPageComponent }
];