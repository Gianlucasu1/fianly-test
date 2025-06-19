import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div class="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
        <img 
          [src]="product.image" 
          [alt]="product.name"
          class="w-full h-full object-cover"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
        <div class="text-gray-400 text-6xl hidden items-center justify-center w-full h-full">
          📦
        </div>
      </div>
      <div class="p-4">
        <div class="mb-2">
          <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {{ product.category }}
          </span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
        <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ product.description }}</p>
        <div class="flex items-center justify-between">
          <span class="text-2xl font-bold text-blue-600">\${{ product.price }}</span>
          <button 
            (click)="viewDetails()"
            class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200">
            View Details
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    `
  ]
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private router: Router) {}

  viewDetails(): void {
    this.router.navigate(['/product', this.product.id]);
  }
} 