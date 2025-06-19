import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, RegistrationFormData } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://fianly-test-api-3c5f0ad60049.herokuapp.com';

  constructor(private http: HttpClient) { }

  /**
   * Register a new user
   */
  registerUser(userData: RegistrationFormData): Observable<User> {
    const url = `${this.apiUrl}/users`;
    
    // Transform form data to match User interface
    const user: Partial<User> = {
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password, // In real app, this should be hashed
      confirmPassword: userData.confirmPassword,
      birthDate: new Date(userData.birthDate),
      gender: userData.gender as 'male' | 'female' | 'other',
      interests: userData.interests,
      country: userData.country
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<User>(url, user, { headers }).pipe(
      map(response => {
        console.log('User registered successfully:', response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get all users
   */
  getUsers(): Observable<User[]> {
    const url = `${this.apiUrl}/users`;
    return this.http.get<User[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get user by ID
   */
  getUserById(id: number): Observable<User> {
    const url = `${this.apiUrl}/users/${id}`;
    return this.http.get<User>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Check if email already exists
   */
  checkEmailExists(email: string): Observable<boolean> {
    const url = `${this.apiUrl}/users?email=${email}`;
    return this.http.get<User[]>(url).pipe(
      map(users => users.length > 0),
      catchError(this.handleError)
    );
  }

  /**
   * Update user
   */
  updateUser(id: number, userData: Partial<User>): Observable<User> {
    const url = `${this.apiUrl}/users/${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<User>(url, userData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete user
   */
  deleteUser(id: number): Observable<void> {
    const url = `${this.apiUrl}/users/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
