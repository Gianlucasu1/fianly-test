import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product.interface';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-6">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Back Button -->
        <button 
          (click)="goBack()"
          class="mb-6 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center">
          ← Back to Products
        </button>

        <div *ngIf="product" class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="md:flex">
            <!-- Product Image -->
            <div class="md:w-1/2 h-96 bg-gray-200 flex items-center justify-center">
              <img 
                [src]="product.image" 
                [alt]="product.name"
                class="max-w-full max-h-full object-contain"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
              <div class="text-gray-400 text-8xl hidden items-center justify-center w-full h-full">
                📦
              </div>
            </div>

            <!-- Product Information -->
            <div class="md:w-1/2 p-8">
              <div class="mb-4">
                <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {{ product.category }}
                </span>
              </div>
              
              <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
              
              <p class="text-4xl font-bold text-blue-600 mb-6">\${{ product.price }}</p>
              
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p class="text-gray-600 leading-relaxed">{{ product.description }}</p>
              </div>

              <div class="space-y-3">
                <button class="w-full bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium transition duration-200">
                  Add to Cart
                </button>
                <button class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md text-lg font-medium transition duration-200">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="!product && !loading" class="text-center py-12">
          <div class="text-gray-400 text-6xl mb-4">❌</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Product not found</h3>
          <p class="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>

        <!-- Loading Spinner -->
        <div *ngIf="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  private loadProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(+id).subscribe({
        next: (product: Product | null) => {
          this.product = product;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading product:', error);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
} 