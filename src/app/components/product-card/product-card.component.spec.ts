import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ProductCardComponent } from './product-card.component';
import { Product } from '../../models/product.interface';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    price: 99.99,
    description: 'This is a test product description',
    category: 'Electronics',
    image: 'https://example.com/test-image.jpg'
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    component.product = mockProduct;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product information correctly', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    
    expect(compiled.textContent).toContain('Test Product');
    expect(compiled.textContent).toContain('$99.99');
    expect(compiled.textContent).toContain('This is a test product description');
    expect(compiled.textContent).toContain('Electronics');
  });

  it('should display product image with correct attributes', () => {
    fixture.detectChanges();
    
    const image = fixture.nativeElement.querySelector('img');
    
    expect(image).toBeTruthy();
    expect(image.src).toBe('https://example.com/test-image.jpg');
    expect(image.alt).toBe('Test Product');
  });

  it('should display category badge', () => {
    fixture.detectChanges();
    
    const categoryBadge = fixture.nativeElement.querySelector('.bg-blue-100');
    
    expect(categoryBadge).toBeTruthy();
    expect(categoryBadge.textContent.trim()).toBe('Electronics');
  });

  it('should display "View Details" button', () => {
    fixture.detectChanges();
    
    const button = fixture.nativeElement.querySelector('button');
    
    expect(button).toBeTruthy();
    expect(button.textContent.trim()).toBe('View Details');
  });

  it('should navigate to product details when viewDetails is called', () => {
    component.viewDetails();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/product', 1]);
  });

  it('should call viewDetails when button is clicked', () => {
    spyOn(component, 'viewDetails');
    fixture.detectChanges();
    
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    
    expect(component.viewDetails).toHaveBeenCalled();
  });

  it('should handle missing product data gracefully', () => {
    component.product = {
      id: 2,
      name: '',
      price: 0,
      description: '',
      category: '',
      image: ''
    };
    
    fixture.detectChanges();
    
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should format price correctly', () => {
    component.product = { ...mockProduct, price: 1234.56 };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('$1234.56');
  });

  it('should truncate long descriptions', () => {
    const longDescription = 'This is a very long product description that should be truncated to show only the first few lines and not overflow the card layout';
    component.product = { ...mockProduct, description: longDescription };
    fixture.detectChanges();
    
    const descriptionElement = fixture.nativeElement.querySelector('.line-clamp-2');
    expect(descriptionElement).toBeTruthy();
    expect(descriptionElement.textContent).toContain(longDescription);
  });
}); 