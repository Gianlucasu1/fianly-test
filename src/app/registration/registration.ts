import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CountriesService } from '../services/countries';
import { UserService } from '../services/user';
import { Country, Interest, RegistrationFormData } from '../models/user.interface';
import { CustomValidators } from '../validators/custom-validators';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css'
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  countries: Country[] = [];
  interests: Interest[] = [
    { id: '1', name: 'Tecnología', value: 'technology' },
    { id: '2', name: 'Deportes', value: 'sports' },
    { id: '3', name: 'Música', value: 'music' },
    { id: '4', name: 'Cine', value: 'movies' },
    { id: '5', name: 'Viajes', value: 'travel' },
    { id: '6', name: 'Cocina', value: 'cooking' },
    { id: '7', name: 'Lectura', value: 'reading' },
    { id: '8', name: 'Arte', value: 'art' }
  ];

  genders = [
    { value: 'male', label: 'Masculino' },
    { value: 'female', label: 'Femenino' },
    { value: 'other', label: 'Otro' }
  ];

  isSubmitting = false;
  submitMessage = '';
  submitSuccess = false;

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
    this.initForm();
    this.loadCountries();
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
   * Navigate to login page
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Initialize the reactive form with all validations
   */
  private initForm(): void {
    this.registrationForm = this.fb.group({
      fullName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        CustomValidators.hasUppercase,
        CustomValidators.hasLowercase,
        CustomValidators.hasNumber,
        CustomValidators.hasSpecialChar
      ]],
      confirmPassword: ['', [
        Validators.required
      ]],
      birthDate: ['', [
        Validators.required,
        CustomValidators.minimumAgeValidator(18)
      ]],
      gender: ['', [
        Validators.required
      ]],
      interests: [[], [
        CustomValidators.interestsValidator
      ]],
      country: ['', [
        Validators.required
      ]]
    }, {
      validators: CustomValidators.passwordMatchValidator
    });

    // Real-time validation feedback
    this.setupFormValidation();
  }

  /**
   * Setup real-time validation feedback
   */
  private setupFormValidation(): void {
    // Password strength indicator
    this.registrationForm.get('password')?.valueChanges.subscribe(() => {
      this.updatePasswordStrength();
    });

    // Confirm password validation
    this.registrationForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });

    // Email validation (check if exists)
    this.registrationForm.get('email')?.valueChanges.subscribe((email) => {
      if (email && this.registrationForm.get('email')?.valid) {
        this.checkEmailExists(email);
      }
    });
  }

  /**
   * Load countries from service
   */
  private loadCountries(): void {
    this.countriesService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        console.log('Countries loaded:', countries);
      },
      error: (error) => {
        console.error('Error loading countries:', error);
      }
    });
  }

  /**
   * Check if email already exists
   */
  private checkEmailExists(email: string): void {
    this.userService.checkEmailExists(email).subscribe({
      next: (exists) => {
        if (exists) {
          this.registrationForm.get('email')?.setErrors({ emailExists: true });
        }
      },
      error: (error) => {
        console.error('Error checking email:', error);
      }
    });
  }

  /**
   * Update password strength indicator
   */
  private updatePasswordStrength(): void {
    const passwordControl = this.registrationForm.get('password');
    if (!passwordControl) return;

    const password = passwordControl.value;
    if (!password) return;

    // This will be used in the template for visual feedback
    const strength = this.calculatePasswordStrength(password);
    passwordControl.setValue(password, { emitEvent: false });
  }

  /**
   * Calculate password strength
   */
  private calculatePasswordStrength(password: string): number {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

    return strength;
  }

  /**
   * Check if passwords match
   */
  private checkPasswordMatch(): void {
    const password = this.registrationForm.get('password')?.value;
    const confirmPassword = this.registrationForm.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      this.registrationForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    }
  }

  /**
   * Handle interest selection
   */
  onInterestChange(interestValue: string, event: any): void {
    const interestsControl = this.registrationForm.get('interests');
    const currentInterests = interestsControl?.value || [];

    if (event.target.checked) {
      if (!currentInterests.includes(interestValue)) {
        interestsControl?.setValue([...currentInterests, interestValue]);
      }
    } else {
      interestsControl?.setValue(currentInterests.filter((i: string) => i !== interestValue));
    }
  }

  /**
   * Check if interest is selected
   */
  isInterestSelected(interestValue: string): boolean {
    const interests = this.registrationForm.get('interests')?.value || [];
    return interests.includes(interestValue);
  }

  /**
   * Get password strength for visual feedback
   */
  getPasswordStrength(): number {
    const password = this.registrationForm.get('password')?.value;
    if (!password) return 0;
    return this.calculatePasswordStrength(password);
  }

  /**
   * Get password strength text
   */
  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 0:
      case 1:
        return 'Muy débil';
      case 2:
        return 'Débil';
      case 3:
        return 'Media';
      case 4:
        return 'Fuerte';
      case 5:
        return 'Muy fuerte';
      default:
        return '';
    }
  }

  /**
   * Get password strength color
   */
  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-blue-500';
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  }

  /**
   * Check if field is valid
   */
  isFieldValid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Check if field is valid and has value
   */
  isFieldValidAndTouched(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return !!(field && field.valid && field.touched);
  }

  /**
   * Get field error message
   */
  getFieldErrorMessage(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;

    switch (fieldName) {
      case 'fullName':
        if (errors['required']) return 'El nombre completo es requerido';
        if (errors['minlength']) return 'El nombre debe tener al menos 2 caracteres';
        if (errors['maxlength']) return 'El nombre no puede exceder 100 caracteres';
        if (errors['pattern']) return 'El nombre solo puede contener letras y espacios';
        break;

      case 'email':
        if (errors['required']) return 'El correo electrónico es requerido';
        if (errors['email']) return 'Ingrese un correo electrónico válido';
        if (errors['emailExists']) return 'Este correo electrónico ya está registrado';
        break;

      case 'password':
        if (errors['required']) return 'La contraseña es requerida';
        if (errors['minlength']) return 'La contraseña debe tener al menos 8 caracteres';
        if (errors['hasUppercase']) return 'La contraseña debe contener al menos una mayúscula';
        if (errors['hasLowercase']) return 'La contraseña debe contener al menos una minúscula';
        if (errors['hasNumber']) return 'La contraseña debe contener al menos un número';
        if (errors['hasSpecialChar']) return 'La contraseña debe contener al menos un carácter especial';
        break;

      case 'confirmPassword':
        if (errors['required']) return 'La confirmación de contraseña es requerida';
        if (errors['passwordMismatch']) return 'Las contraseñas no coinciden';
        break;

      case 'birthDate':
        if (errors['required']) return 'La fecha de nacimiento es requerida';
        if (errors['minimumAge']) return `Debe ser mayor de ${errors['minimumAge'].requiredAge} años`;
        break;

      case 'gender':
        if (errors['required']) return 'Debe seleccionar un género';
        break;

      case 'interests':
        if (errors['required']) return 'Debe seleccionar al menos un interés';
        break;

      case 'country':
        if (errors['required']) return 'Debe seleccionar un país';
        break;
    }

    return '';
  }

  /**
   * Password requirement helper methods for template
   */
  hasMinLength(): boolean {
    const password = this.registrationForm.get('password')?.value;
    return password && password.length >= 8;
  }

  hasUppercase(): boolean {
    const password = this.registrationForm.get('password')?.value;
    return password && /[A-Z]/.test(password);
  }

  hasLowercase(): boolean {
    const password = this.registrationForm.get('password')?.value;
    return password && /[a-z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.registrationForm.get('password')?.value;
    return password && /\d/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this.registrationForm.get('password')?.value;
    return password && /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.isSubmitting = true;
      this.submitMessage = '';
      this.submitSuccess = false;
      
      const formData: RegistrationFormData = this.registrationForm.value;
      
      this.userService.registerUser(formData).subscribe({
        next: (response) => {
          console.log('User registered successfully:', response);
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.submitMessage = '¡Usuario registrado exitosamente! Redirigiendo al login...';
          
          // Store registration success in localStorage
          this.storeRegistrationData(response);
          
          // Redirect to login page after successful registration
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.isSubmitting = false;
          this.submitSuccess = false;
          this.submitMessage = 'Error al registrar usuario. Por favor, intente nuevamente.';
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Store registration data in localStorage
   */
  private storeRegistrationData(user: any): void {
    const registrationData = {
      registrationTime: new Date().toISOString(),
      userEmail: user.email,
      registrationSuccess: true
    };

    localStorage.setItem('registrationData', JSON.stringify(registrationData));
    console.log('Registration data stored in localStorage:', registrationData);
  }

  /**
   * Mark all form controls as touched to trigger validation display
   */
  private markFormGroupTouched(): void {
    Object.keys(this.registrationForm.controls).forEach(key => {
      const control = this.registrationForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Reset form
   */
  onReset(): void {
    this.registrationForm.reset();
    this.isSubmitting = false;
    this.submitMessage = '';
    this.submitSuccess = false;
  }
}
