import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  /**
   * Validator to check if password and confirm password match
   */
  static passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  };

  /**
   * Validator to check if user is at least 18 years old
   */
  static minimumAgeValidator(minAge: number = 18): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age >= minAge ? null : { minimumAge: { requiredAge: minAge, actualAge: age } };
    };
  }

  /**
   * Validator to check if at least one interest is selected
   */
  static interestsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || !Array.isArray(control.value)) {
      return { required: true };
    }

    return control.value.length > 0 ? null : { required: true };
  };

  /**
   * Validator to check if password contains at least one uppercase letter
   */
  static hasUppercase: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    return /[A-Z]/.test(control.value) ? null : { hasUppercase: true };
  };

  /**
   * Validator to check if password contains at least one lowercase letter
   */
  static hasLowercase: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    return /[a-z]/.test(control.value) ? null : { hasLowercase: true };
  };

  /**
   * Validator to check if password contains at least one number
   */
  static hasNumber: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    return /\d/.test(control.value) ? null : { hasNumber: true };
  };

  /**
   * Validator to check if password contains at least one special character
   */
  static hasSpecialChar: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    return /[!@#$%^&*(),.?":{}|<>]/.test(control.value) ? null : { hasSpecialChar: true };
  };
} 