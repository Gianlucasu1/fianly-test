export interface User {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: Date;
  gender: 'male' | 'female' | 'other';
  interests: string[];
  country: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
}

export interface Interest {
  id: string;
  name: string;
  value: string;
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  gender: string;
  interests: string[];
  country: string;
} 