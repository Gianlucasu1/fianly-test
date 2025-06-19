import { TestBed } from '@angular/core/testing';
import { ProductService, ProductFilters } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all products without filters', (done) => {
    service.getProducts().subscribe(response => {
      expect(response.products.length).toBeGreaterThan(0);
      expect(response.total).toBeGreaterThan(0);
      expect(response.page).toBe(1);
      expect(response.pageSize).toBe(6);
      done();
    });
  });

  it('should filter products by search term', (done) => {
    const filters: ProductFilters = {
      searchTerm: 'headphones'
    };

    service.getProducts(filters).subscribe(response => {
      expect(response.products.length).toBeGreaterThan(0);
      const hasHeadphones = response.products.some(p => 
        p.name.toLowerCase().includes('headphones') || 
        p.category.toLowerCase().includes('headphones')
      );
      expect(hasHeadphones).toBeTruthy();
      done();
    });
  });

  it('should filter products by category', (done) => {
    const filters: ProductFilters = {
      searchTerm: 'electronics'
    };

    service.getProducts(filters).subscribe(response => {
      const allElectronics = response.products.every(p => 
        p.category.toLowerCase().includes('electronics') ||
        p.name.toLowerCase().includes('electronics')
      );
      expect(allElectronics).toBeTruthy();
      done();
    });
  });

  it('should sort products by name ascending', (done) => {
    const filters: ProductFilters = {
      sortBy: 'name',
      sortOrder: 'asc'
    };

    service.getProducts(filters).subscribe(response => {
      const products = response.products;
      for (let i = 0; i < products.length - 1; i++) {
        expect(products[i].name.toLowerCase() <= products[i + 1].name.toLowerCase()).toBeTruthy();
      }
      done();
    });
  });

  it('should sort products by name descending', (done) => {
    const filters: ProductFilters = {
      sortBy: 'name',
      sortOrder: 'desc'
    };

    service.getProducts(filters).subscribe(response => {
      const products = response.products;
      for (let i = 0; i < products.length - 1; i++) {
        expect(products[i].name.toLowerCase() >= products[i + 1].name.toLowerCase()).toBeTruthy();
      }
      done();
    });
  });

  it('should sort products by price ascending', (done) => {
    const filters: ProductFilters = {
      sortBy: 'price',
      sortOrder: 'asc'
    };

    service.getProducts(filters).subscribe(response => {
      const products = response.products;
      for (let i = 0; i < products.length - 1; i++) {
        expect(products[i].price <= products[i + 1].price).toBeTruthy();
      }
      done();
    });
  });

  it('should sort products by price descending', (done) => {
    const filters: ProductFilters = {
      sortBy: 'price',
      sortOrder: 'desc'
    };

    service.getProducts(filters).subscribe(response => {
      const products = response.products;
      for (let i = 0; i < products.length - 1; i++) {
        expect(products[i].price >= products[i + 1].price).toBeTruthy();
      }
      done();
    });
  });

  it('should paginate products correctly', (done) => {
    const filters: ProductFilters = {
      page: 1,
      pageSize: 3
    };

    service.getProducts(filters).subscribe(response => {
      expect(response.products.length).toBeLessThanOrEqual(3);
      expect(response.page).toBe(1);
      expect(response.pageSize).toBe(3);
      expect(response.totalPages).toBeGreaterThan(0);
      done();
    });
  });

  it('should return second page of products', (done) => {
    const filters: ProductFilters = {
      page: 2,
      pageSize: 3
    };

    service.getProducts(filters).subscribe(response => {
      expect(response.page).toBe(2);
      expect(response.pageSize).toBe(3);
      done();
    });
  });

  it('should get product by ID', (done) => {
    service.getProductById(1).subscribe(product => {
      expect(product).toBeTruthy();
      expect(product?.id).toBe(1);
      expect(product?.name).toBeTruthy();
      expect(product?.price).toBeGreaterThan(0);
      done();
    });
  });

  it('should return null for non-existent product ID', (done) => {
    service.getProductById(999).subscribe(product => {
      expect(product).toBeNull();
      done();
    });
  });

  it('should get unique categories', (done) => {
    service.getCategories().subscribe(categories => {
      expect(categories.length).toBeGreaterThan(0);
      
      // Check that categories are unique
      const uniqueCategories = [...new Set(categories)];
      expect(categories.length).toBe(uniqueCategories.length);
      
      // Check that common categories exist
      expect(categories).toContain('Electronics');
      expect(categories).toContain('Gaming');
      expect(categories).toContain('Accessories');
      done();
    });
  });

  it('should combine search and sort filters', (done) => {
    const filters: ProductFilters = {
      searchTerm: 'e', // Should match multiple products
      sortBy: 'price',
      sortOrder: 'asc'
    };

    service.getProducts(filters).subscribe(response => {
      expect(response.products.length).toBeGreaterThan(0);
      
      // Check that search filter is applied
      const allMatchSearch = response.products.every(p => 
        p.name.toLowerCase().includes('e') || 
        p.category.toLowerCase().includes('e')
      );
      expect(allMatchSearch).toBeTruthy();
      
      // Check that sort is applied
      const products = response.products;
      for (let i = 0; i < products.length - 1; i++) {
        expect(products[i].price <= products[i + 1].price).toBeTruthy();
      }
      done();
    });
  });

  it('should handle empty search results', (done) => {
    const filters: ProductFilters = {
      searchTerm: 'nonexistentproduct123'
    };

    service.getProducts(filters).subscribe(response => {
      expect(response.products.length).toBe(0);
      expect(response.total).toBe(0);
      expect(response.totalPages).toBe(0);
      done();
    });
  });

  it('should calculate total pages correctly', (done) => {
    const filters: ProductFilters = {
      pageSize: 3
    };

    service.getProducts(filters).subscribe(response => {
      const expectedTotalPages = Math.ceil(response.total / 3);
      expect(response.totalPages).toBe(expectedTotalPages);
      done();
    });
  });

  it('should have all required product properties', (done) => {
    service.getProducts().subscribe(response => {
      const product = response.products[0];
      expect(product.id).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.price).toBeDefined();
      expect(product.description).toBeDefined();
      expect(product.category).toBeDefined();
      expect(product.image).toBeDefined();
      done();
    });
  });
}); 