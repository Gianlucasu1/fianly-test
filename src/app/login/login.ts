import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  submitSuccess = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
    this.initForm();
  }

  /**
   * Check if user is already logged in and redirect to dashboard
   */
  private checkAuthStatus(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (isLoggedIn === 'true' && currentUser) {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Initialize the login form
   */
  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required
      ]]
    });
  }

  /**
   * Check if field is valid
   */
  isFieldValid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Get field error message
   */
  getFieldErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;

    switch (fieldName) {
      case 'email':
        if (errors['required']) return 'El correo electrónico es requerido';
        if (errors['email']) return 'Ingrese un correo electrónico válido';
        break;

      case 'password':
        if (errors['required']) return 'La contraseña es requerida';
        break;
    }

    return '';
  }

  /**
   * Handle login form submission
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.submitMessage = '';
      this.submitSuccess = false;

      const { email, password } = this.loginForm.value;

      // Get all users to check credentials
      this.userService.getUsers().subscribe({
        next: (users) => {
          const user = users.find(u => u.email === email && u.password === password);
          
          if (user) {
            // Store user data in localStorage
            this.storeUserData(user);
            
            this.submitSuccess = true;
            this.submitMessage = '¡Inicio de sesión exitoso! Redirigiendo...';
            
            // Redirect to dashboard or home page
            setTimeout(() => {
              this.router.navigate(['/dashboard']); // You can change this route
            }, 1500);
          } else {
            this.submitSuccess = false;
            this.submitMessage = 'Credenciales incorrectas. Por favor, verifique su email y contraseña.';
          }
          
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Login error:', error);
          this.isSubmitting = false;
          this.submitSuccess = false;
          this.submitMessage = 'Error al iniciar sesión. Por favor, intente nuevamente.';
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Store user data in localStorage
   */
  private storeUserData(user: any): void {
    const userData = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      gender: user.gender,
      interests: user.interests,
      country: user.country,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    console.log('User data stored in localStorage:', userData);
  }

  /**
   * Mark all form controls as touched to trigger validation display
   */
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Navigate to registration page
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  /**
   * Reset form
   */
  onReset(): void {
    this.loginForm.reset();
    this.isSubmitting = false;
    this.submitMessage = '';
    this.submitSuccess = false;
  }
}
