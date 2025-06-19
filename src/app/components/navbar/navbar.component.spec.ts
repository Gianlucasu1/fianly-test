import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user name from localStorage on initialization', () => {
    const mockUser = {
      fullName: 'John Doe',
      email: 'john@example.com'
    };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));

    fixture.detectChanges();

    expect(component.userName).toBe('John Doe');
  });

  it('should set default user name when no user in localStorage', () => {
    fixture.detectChanges();

    expect(component.userName).toBe('');
  });

  it('should set "User" as default when fullName is not available', () => {
    const mockUser = {
      email: 'john@example.com'
    };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));

    fixture.detectChanges();

    expect(component.userName).toBe('User');
  });

  it('should display user name in template', () => {
    const mockUser = {
      fullName: 'Jane Smith',
      email: 'jane@example.com'
    };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Welcome, Jane Smith');
  });

  it('should clear localStorage and navigate to root on logout', () => {
    const mockUser = {
      fullName: 'John Doe',
      email: 'john@example.com'
    };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('registrationData', JSON.stringify({ test: 'data' }));

    component.logout();

    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
    expect(localStorage.getItem('registrationData')).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should render logout button', () => {
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const logoutButton = compiled.querySelector('button');
    
    expect(logoutButton).toBeTruthy();
    expect(logoutButton.textContent.trim()).toBe('Logout');
  });

  it('should call logout when logout button is clicked', () => {
    spyOn(component, 'logout');
    fixture.detectChanges();

    const logoutButton = fixture.nativeElement.querySelector('button');
    logoutButton.click();

    expect(component.logout).toHaveBeenCalled();
  });
}); 