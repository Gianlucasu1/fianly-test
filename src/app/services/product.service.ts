import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.interface';

export interface ProductFilters {
  searchTerm?: string;
  sortBy?: 'name' | 'price';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private mockProducts: Product[] = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      category: 'Electronics',
      image: 'https://via.placeholder.com/300x300?text=Headphones',
      description: 'High-quality wireless headphones with noise cancellation and long battery life. Perfect for music lovers and professionals who need crystal clear audio quality.'
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      category: 'Electronics',
      image: 'https://via.placeholder.com/300x300?text=Smart+Watch',
      description: 'Feature-rich smartwatch with health tracking, GPS, and water resistance. Monitor your fitness goals and stay connected on the go.'
    },
    {
      id: 3,
      name: 'Laptop Stand',
      price: 29.99,
      category: 'Accessories',
      image: 'https://via.placeholder.com/300x300?text=Laptop+Stand',
      description: 'Ergonomic laptop stand made from premium aluminum with adjustable height. Improve your posture and workspace comfort.'
    },
    {
      id: 4,
      name: 'USB-C Hub',
      price: 49.99,
      category: 'Accessories',
      image: 'https://via.placeholder.com/300x300?text=USB+Hub',
      description: 'Multi-port USB-C hub with HDMI, USB 3.0, and fast charging capabilities. Expand your device connectivity effortlessly.'
    },
    {
      id: 5,
      name: 'Bluetooth Speaker',
      price: 79.99,
      category: 'Audio',
      image: 'https://via.placeholder.com/300x300?text=Speaker',
      description: 'Portable Bluetooth speaker with 360-degree sound and waterproof design. Take your music anywhere with premium sound quality.'
    },
    {
      id: 6,
      name: 'Gaming Mouse',
      price: 59.99,
      category: 'Gaming',
      image: 'https://via.placeholder.com/300x300?text=Gaming+Mouse',
      description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons. Enhance your gaming performance.'
    },
    {
      id: 7,
      name: 'Phone Case',
      price: 19.99,
      category: 'Accessories',
      image: 'https://via.placeholder.com/300x300?text=Phone+Case',
      description: 'Durable phone case with military-grade protection and wireless charging support. Keep your device safe and stylish.'
    },
    {
      id: 8,
      name: 'Tablet',
      price: 299.99,
      category: 'Electronics',
      image: 'https://via.placeholder.com/300x300?text=Tablet',
      description: 'Lightweight tablet with high-resolution display perfect for work and entertainment. Productivity and fun in one device.'
    },
    {
      id: 9,
      name: 'Mechanical Keyboard',
      price: 129.99,
      category: 'Gaming',
      image: 'https://via.placeholder.com/300x300?text=Keyboard',
      description: 'Premium mechanical keyboard with backlit keys and tactile switches. Perfect for gaming and professional typing.'
    },
    {
      id: 10,
      name: 'Webcam HD',
      price: 89.99,
      category: 'Electronics',
      image: 'https://via.placeholder.com/300x300?text=Webcam',
      description: 'High-definition webcam with auto-focus and built-in microphone. Ideal for video conferencing and content creation.'
    },
    {
      id: 11,
      name: 'Power Bank',
      price: 39.99,
      category: 'Accessories',
      image: 'https://via.placeholder.com/300x300?text=Power+Bank',
      description: 'Portable power bank with fast charging technology and multiple device support. Never run out of battery again.'
    },
    {
      id: 12,
      name: 'Wireless Charger',
      price: 24.99,
      category: 'Accessories',
      image: 'https://via.placeholder.com/300x300?text=Wireless+Charger',
      description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Convenient and cable-free charging solution.'
    }
  ];

  constructor() { }

  getProducts(filters: ProductFilters = {}): Observable<ProductsResponse> {
    let filteredProducts = [...this.mockProducts];

    // Apply search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredProducts.sort((a, b) => {
        const aValue = filters.sortBy === 'price' ? a.price : a.name.toLowerCase();
        const bValue = filters.sortBy === 'price' ? b.price : b.name.toLowerCase();
        
        if (filters.sortOrder === 'desc') {
          return aValue < bValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Apply pagination
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 6;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const response: ProductsResponse = {
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredProducts.length / pageSize)
    };

    return of(response);
  }

  getProductById(id: number): Observable<Product | null> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product || null);
  }

  getCategories(): Observable<string[]> {
    const categories = [...new Set(this.mockProducts.map(p => p.category))];
    return of(categories);
  }
} 