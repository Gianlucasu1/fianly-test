import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { redirectGuard } from './redirect.guard';

describe('redirectGuard', () => {
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should redirect to dashboard when user is logged in', () => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify({ id: 1, name: 'Test User' }));

    const result = TestBed.runInInjectionContext(() => 
      redirectGuard({} as any, {} as any)
    );

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should redirect to register when user is not logged in', () => {
    const result = TestBed.runInInjectionContext(() => 
      redirectGuard({} as any, {} as any)
    );

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should redirect to register when isLoggedIn is false', () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.setItem('currentUser', JSON.stringify({ id: 1, name: 'Test User' }));

    const result = TestBed.runInInjectionContext(() => 
      redirectGuard({} as any, {} as any)
    );

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should redirect to register when currentUser is missing', () => {
    localStorage.setItem('isLoggedIn', 'true');

    const result = TestBed.runInInjectionContext(() => 
      redirectGuard({} as any, {} as any)
    );

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should redirect to register when both isLoggedIn and currentUser are missing', () => {
    const result = TestBed.runInInjectionContext(() => 
      redirectGuard({} as any, {} as any)
    );

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should redirect to register when localStorage is empty', () => {
    const result = TestBed.runInInjectionContext(() => 
      redirectGuard({} as any, {} as any)
    );

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
  });
}); 