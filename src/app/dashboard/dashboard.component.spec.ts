import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { ProductService, ProductsResponse } from '../services/product.service';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { ProductCardComponent } from '../components/product-card/product-card.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockProductService: jasmine.SpyObj<ProductService>;

  const mockProductsResponse: ProductsResponse = {
    products: [
      {
        id: 1,
        name: 'Product 1',
        price: 99.99,
        description: 'Description 1',
        category: 'Electronics',
        image: 'image1.jpg'
      },
      {
        id: 2,
        name: 'Product 2',
        price: 149.99,
        description: 'Description 2',
        category: 'Gaming',
        image: 'image2.jpg'
      }
    ],
    total: 12,
    page: 1,
    pageSize: 6,
    totalPages: 2
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ProductService, useValue: productServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockProductService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
  });

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on initialization', () => {
    mockProductService.getProducts.and.returnValue(of(mockProductsResponse));

    component.ngOnInit();

    expect(mockProductService.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProductsResponse.products);
    expect(component.totalProducts).toBe(12);
    expect(component.totalPages).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should handle service error when loading products', () => {
    mockProductService.getProducts.and.returnValue(throwError(() => new Error('Service error')));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(console.error).toHaveBeenCalledWith('Error loading products:', jasmine.any(Error));
  });

  it('should update search term and reload products', () => {
    mockProductService.getProducts.and.returnValue(of(mockProductsResponse));
    component.searchTerm = 'test search';

    component.onSearchChange();

    expect(component.currentPage).toBe(1);
    expect(mockProductService.getProducts).toHaveBeenCalledWith(
      jasmine.objectContaining({
        searchTerm: 'test search',
        page: 1
      })
    );
  });

  it('should update sort options and reload products', () => {
    mockProductService.getProducts.and.returnValue(of(mockProductsResponse));
    component.sortBy = 'price';
    component.sortOrder = 'desc';

    component.onSortChange();

    expect(component.currentPage).toBe(1);
    expect(mockProductService.getProducts).toHaveBeenCalledWith(
      jasmine.objectContaining({
        sortBy: 'price',
        sortOrder: 'desc',
        page: 1
      })
    );
  });

  it('should navigate to specific page', () => {
    mockProductService.getProducts.and.returnValue(of(mockProductsResponse));
    component.totalPages = 3;

    component.goToPage(2);

    expect(component.currentPage).toBe(2);
    expect(mockProductService.getProducts).toHaveBeenCalledWith(
      jasmine.objectContaining({
        page: 2
      })
    );
  });

  it('should not navigate to invalid page numbers', () => {
    mockProductService.getProducts.and.returnValue(of(mockProductsResponse));
    component.totalPages = 3;
    component.currentPage = 1;

    component.goToPage(0); // Invalid page
    expect(component.currentPage).toBe(1);

    component.goToPage(4); // Invalid page
    expect(component.currentPage).toBe(1);
  });

  it('should display loading spinner when loading', () => {
    component.loading = true;
    fixture.detectChanges();

    const loadingSpinner = fixture.nativeElement.querySelector('.animate-spin');
    expect(loadingSpinner).toBeTruthy();
  });

  it('should display search input', () => {
    mockProductService.getProducts.and.returnValue(of(mockProductsResponse));
    fixture.detectChanges();

    const searchInput = fixture.nativeElement.querySelector('input[type="text"]');
    expect(searchInput).toBeTruthy();
    expect(searchInput.placeholder).toContain('Search');
  });

  it('should display sort controls', () => {
    mockProductService.getProducts.and.returnValue(of(mockProductsResponse));
    fixture.detectChanges();

    const sortBySelect = fixture.nativeElement.querySelector('select#sortBy');
    const sortOrderSelect = fixture.nativeElement.querySelector('select#sortOrder');

    expect(sortBySelect).toBeTruthy();
    expect(sortOrderSelect).toBeTruthy();
  });

  it('should display pagination when multiple pages exist', () => {
    mockProductService.getProducts.and.returnValue(of(mockProductsResponse));
    component.totalPages = 3;
    fixture.detectChanges();

    const paginationButtons = fixture.nativeElement.querySelectorAll('button');
    const paginationContainer = Array.from(paginationButtons).some((btn: any) => 
      btn.textContent.includes('First') || btn.textContent.includes('Previous')
    );

    expect(paginationContainer).toBeTruthy();
  });

  it('should not display pagination when only one page exists', () => {
    const singlePageResponse = { ...mockProductsResponse, totalPages: 1 };
    mockProductService.getProducts.and.returnValue(of(singlePageResponse));
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).not.toContain('First');
    expect(compiled.textContent).not.toContain('Previous');
  });

  it('should display "no products found" message when no products', () => {
    const emptyResponse = { ...mockProductsResponse, products: [], total: 0 };
    mockProductService.getProducts.and.returnValue(of(emptyResponse));
    component.loading = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('No products found');
  });

  it('should display correct results info', () => {
    mockProductService.getProducts.and.returnValue(of(mockProductsResponse));
    component.currentPage = 1;
    component.pageSize = 6;
    component.totalProducts = 12;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Showing 1-6 of 12 products');
  });

  it('should call loadProducts with correct filters', () => {
    mockProductService.getProducts.and.returnValue(of(mockProductsResponse));
    
    component.searchTerm = 'electronics';
    component.sortBy = 'name';
    component.sortOrder = 'asc';
    component.currentPage = 2;
    component.pageSize = 6;

    component.loadProducts();

    expect(mockProductService.getProducts).toHaveBeenCalledWith({
      searchTerm: 'electronics',
      sortBy: 'name',
      sortOrder: 'asc',
      page: 2,
      pageSize: 6
    });
  });

  it('should reset to first page when searching', () => {
    mockProductService.getProducts.and.returnValue(of(mockProductsResponse));
    component.currentPage = 3;
    component.searchTerm = 'new search';

    component.onSearchChange();

    expect(component.currentPage).toBe(1);
  });

  it('should reset to first page when sorting', () => {
    mockProductService.getProducts.and.returnValue(of(mockProductsResponse));
    component.currentPage = 3;
    component.sortBy = 'price';

    component.onSortChange();

    expect(component.currentPage).toBe(1);
  });
}); 