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
      name: 'Auriculares Inalámbricos',
      price: 99.99,
      category: 'Electrónicos',
      image: 'https://via.placeholder.com/300x300?text=Auriculares',
      description: 'Auriculares inalámbricos de alta calidad con cancelación de ruido y larga duración de batería. Perfectos para amantes de la música y profesionales que necesitan calidad de audio cristalina.'
    },
    {
      id: 2,
      name: 'Reloj Inteligente',
      price: 199.99,
      category: 'Electrónicos',
      image: 'https://via.placeholder.com/300x300?text=Reloj+Inteligente',
      description: 'Reloj inteligente con múltiples funciones, seguimiento de salud, GPS y resistencia al agua. Monitorea tus objetivos de fitness y mantente conectado en movimiento.'
    },
    {
      id: 3,
      name: 'Soporte para Laptop',
      price: 29.99,
      category: 'Accesorios',
      image: 'https://via.placeholder.com/300x300?text=Soporte+Laptop',
      description: 'Soporte ergonómico para laptop hecho de aluminio premium con altura ajustable. Mejora tu postura y comodidad en el espacio de trabajo.'
    },
    {
      id: 4,
      name: 'Hub USB-C',
      price: 49.99,
      category: 'Accesorios',
      image: 'https://via.placeholder.com/300x300?text=Hub+USB',
      description: 'Hub USB-C multipuerto con HDMI, USB 3.0 y capacidades de carga rápida. Expande la conectividad de tus dispositivos sin esfuerzo.'
    },
    {
      id: 5,
      name: 'Altavoz Bluetooth',
      price: 79.99,
      category: 'Audio',
      image: 'https://via.placeholder.com/300x300?text=Altavoz',
      description: 'Altavoz Bluetooth portátil con sonido de 360 grados y diseño resistente al agua. Lleva tu música a cualquier lugar con calidad de sonido premium.'
    },
    {
      id: 6,
      name: 'Mouse Gaming',
      price: 59.99,
      category: 'Gaming',
      image: 'https://via.placeholder.com/300x300?text=Mouse+Gaming',
      description: 'Mouse gaming de alta precisión con iluminación RGB personalizable y botones programables. Mejora tu rendimiento en los juegos.'
    },
    {
      id: 7,
      name: 'Funda para Teléfono',
      price: 19.99,
      category: 'Accesorios',
      image: 'https://via.placeholder.com/300x300?text=Funda+Telefono',
      description: 'Funda duradera para teléfono con protección de grado militar y soporte para carga inalámbrica. Mantén tu dispositivo seguro y con estilo.'
    },
    {
      id: 8,
      name: 'Tablet',
      price: 299.99,
      category: 'Electrónicos',
      image: 'https://via.placeholder.com/300x300?text=Tablet',
      description: 'Tablet ligera con pantalla de alta resolución perfecta para trabajo y entretenimiento. Productividad y diversión en un solo dispositivo.'
    },
    {
      id: 9,
      name: 'Teclado Mecánico',
      price: 129.99,
      category: 'Gaming',
      image: 'https://via.placeholder.com/300x300?text=Teclado',
      description: 'Teclado mecánico premium con teclas retroiluminadas y switches táctiles. Perfecto para gaming y escritura profesional.'
    },
    {
      id: 10,
      name: 'Cámara Web HD',
      price: 89.99,
      category: 'Electrónicos',
      image: 'https://via.placeholder.com/300x300?text=Camara+Web',
      description: 'Cámara web de alta definición con enfoque automático y micrófono integrado. Ideal para videoconferencias y creación de contenido.'
    },
    {
      id: 11,
      name: 'Batería Portátil',
      price: 39.99,
      category: 'Accesorios',
      image: 'https://via.placeholder.com/300x300?text=Bateria+Portatil',
      description: 'Batería portátil con tecnología de carga rápida y soporte para múltiples dispositivos. Nunca te quedes sin batería otra vez.'
    },
    {
      id: 12,
      name: 'Cargador Inalámbrico',
      price: 24.99,
      category: 'Accesorios',
      image: 'https://via.placeholder.com/300x300?text=Cargador+Inalambrico',
      description: 'Base de carga inalámbrica rápida compatible con todos los dispositivos habilitados para Qi. Solución de carga conveniente y sin cables.'
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