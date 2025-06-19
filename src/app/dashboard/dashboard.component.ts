import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { Product } from '../models/product.interface';
import { ProductService, ProductFilters, ProductsResponse } from '../services/product.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, ProductCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar></app-navbar>
      
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Product Catalog</h1>
          <p class="mt-2 text-gray-600">Discover our amazing products with advanced filtering and search.</p>
        </div>

        <!-- Search and Filters -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Search -->
            <div>
              <label for="search" class="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
              <input
                id="search"
                type="text"
                [(ngModel)]="searchTerm"
                (input)="onSearchChange()"
                placeholder="Search by name or category..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>

            <!-- Sort By -->
            <div>
              <label for="sortBy" class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                id="sortBy"
                [(ngModel)]="sortBy"
                (change)="onSortChange()"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Default</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>

            <!-- Sort Order -->
            <div>
              <label for="sortOrder" class="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <select
                id="sortOrder"
                [(ngModel)]="sortOrder"
                (change)="onSortChange()"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Results Info -->
        <div class="flex justify-between items-center mb-6">
          <div class="text-gray-600">
            Showing {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalProducts) }} of {{ totalProducts }} products
          </div>
          <div class="text-sm text-gray-600">
            Page {{ currentPage }} of {{ totalPages }}
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>

        <!-- Products Grid -->
        <div *ngIf="!loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
          <app-product-card 
            *ngFor="let product of products" 
            [product]="product">
          </app-product-card>
        </div>

        <!-- No Results -->
        <div *ngIf="!loading && products.length === 0" class="text-center py-12">
          <div class="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p class="text-gray-600">Try adjusting your search terms or filters.</p>
        </div>

        <!-- Pagination -->
        <div *ngIf="!loading && totalPages > 1" class="flex justify-center items-center space-x-2">
          <button
            (click)="goToPage(1)"
            [disabled]="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            First
          </button>
          
          <button
            (click)="goToPage(currentPage - 1)"
            [disabled]="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>

          <span class="px-4 py-2 text-sm font-medium text-gray-700 bg-blue-50 border border-blue-200 rounded-md">
            {{ currentPage }}
          </span>

          <button
            (click)="goToPage(currentPage + 1)"
            [disabled]="currentPage === totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
          
          <button
            (click)="goToPage(totalPages)"
            [disabled]="currentPage === totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Last
          </button>
        </div>
      </main>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  
  // Filter properties
  searchTerm = '';
  sortBy: 'name' | 'price' | '' = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  // Pagination properties
  currentPage = 1;
  pageSize = 6;
  totalProducts = 0;
  totalPages = 0;

  // Expose Math to template
  Math = Math;

  constructor(
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    
    const filters: ProductFilters = {
      searchTerm: this.searchTerm || undefined,
      sortBy: this.sortBy || undefined,
      sortOrder: this.sortOrder,
      page: this.currentPage,
      pageSize: this.pageSize
    };

    this.productService.getProducts(filters).subscribe({
      next: (response: ProductsResponse) => {
        this.products = response.products;
        this.totalProducts = response.total;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    this.currentPage = 1; // Reset to first page when searching
    this.loadProducts();
  }

  onSortChange(): void {
    this.currentPage = 1; // Reset to first page when sorting
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }
} 