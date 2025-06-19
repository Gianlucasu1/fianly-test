import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductDetailsComponent } from './product-details.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockProductService: jasmine.SpyObj<ProductService>;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    price: 99.99,
    description: 'This is a detailed test product description',
    category: 'Electronics',
    image: 'https://example.com/test-image.jpg'
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProductById']);
    
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ProductService, useValue: productServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockProductService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product on initialization', () => {
    mockProductService.getProductById.and.returnValue(of(mockProduct));
    
    component.ngOnInit();
    
    expect(mockProductService.getProductById).toHaveBeenCalledWith(1);
    expect(component.product).toEqual(mockProduct);
    expect(component.loading).toBeFalse();
  });

  it('should handle product not found', () => {
    mockProductService.getProductById.and.returnValue(of(null));
    
    component.ngOnInit();
    
    expect(component.product).toBeNull();
    expect(component.loading).toBeFalse();
  });

  it('should handle service error', () => {
    const errorMessage = 'Service error';
    mockProductService.getProductById.and.returnValue(throwError(() => new Error(errorMessage)));
    spyOn(console, 'error');
    
    component.ngOnInit();
    
    expect(component.product).toBeNull();
    expect(component.loading).toBeFalse();
    expect(console.error).toHaveBeenCalledWith('Error loading product:', jasmine.any(Error));
  });

  it('should handle missing product ID', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);
    
    component.ngOnInit();
    
    expect(mockProductService.getProductById).not.toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should navigate back to dashboard when goBack is called', () => {
    component.goBack();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should display product details when product is loaded', () => {
    mockProductService.getProductById.and.returnValue(of(mockProduct));
    
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test Product');
    expect(compiled.textContent).toContain('$99.99');
    expect(compiled.textContent).toContain('This is a detailed test product description');
    expect(compiled.textContent).toContain('Electronics');
  });

  it('should display loading spinner when loading', () => {
    component.loading = true;
    component.product = null;
    
    fixture.detectChanges();
    
    const loadingSpinner = fixture.nativeElement.querySelector('.animate-spin');
    expect(loadingSpinner).toBeTruthy();
  });

  it('should display not found message when product is null and not loading', () => {
    component.loading = false;
    component.product = null;
    
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Product not found');
    expect(compiled.textContent).toContain("The product you're looking for doesn't exist");
  });

  it('should display back button', () => {
    mockProductService.getProductById.and.returnValue(of(mockProduct));
    fixture.detectChanges();
    
    const backButton = fixture.nativeElement.querySelector('button');
    expect(backButton).toBeTruthy();
    expect(backButton.textContent).toContain('Back to Products');
  });

  it('should call goBack when back button is clicked', () => {
    spyOn(component, 'goBack');
    mockProductService.getProductById.and.returnValue(of(mockProduct));
    fixture.detectChanges();
    
    const backButton = fixture.nativeElement.querySelector('button');
    backButton.click();
    
    expect(component.goBack).toHaveBeenCalled();
  });

  it('should display product image with correct attributes', () => {
    mockProductService.getProductById.and.returnValue(of(mockProduct));
    fixture.detectChanges();
    
    const image = fixture.nativeElement.querySelector('img');
    expect(image).toBeTruthy();
    expect(image.src).toBe('https://example.com/test-image.jpg');
    expect(image.alt).toBe('Test Product');
  });

  it('should display action buttons', () => {
    mockProductService.getProductById.and.returnValue(of(mockProduct));
    fixture.detectChanges();
    
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const actionButtons = Array.from(buttons).filter((btn: any) => 
      btn.textContent.includes('Add to Cart') || btn.textContent.includes('Add to Wishlist')
    );
    
    expect(actionButtons.length).toBe(2);
  });
}); 