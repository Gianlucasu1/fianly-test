import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Country } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private apiUrl = 'https://fianly-test-api-3c5f0ad60049.herokuapp.com';

  // Fallback data in case API is not available
  private fallbackCountries: Country[] = [
    { id: '1', name: 'Argentina', code: 'AR' },
    { id: '2', name: 'Bolivia', code: 'BO' },
    { id: '3', name: 'Brasil', code: 'BR' },
    { id: '4', name: 'Chile', code: 'CL' },
    { id: '5', name: 'Colombia', code: 'CO' },
    { id: '6', name: 'Costa Rica', code: 'CR' },
    { id: '7', name: 'Cuba', code: 'CU' },
    { id: '8', name: 'Ecuador', code: 'EC' },
    { id: '9', name: 'El Salvador', code: 'SV' },
    { id: '10', name: 'España', code: 'ES' },
    { id: '11', name: 'Estados Unidos', code: 'US' },
    { id: '12', name: 'Guatemala', code: 'GT' },
    { id: '13', name: 'Honduras', code: 'HN' },
    { id: '14', name: 'México', code: 'MX' },
    { id: '15', name: 'Nicaragua', code: 'NI' },
    { id: '16', name: 'Panamá', code: 'PA' },
    { id: '17', name: 'Paraguay', code: 'PY' },
    { id: '18', name: 'Perú', code: 'PE' },
    { id: '19', name: 'República Dominicana', code: 'DO' },
    { id: '20', name: 'Uruguay', code: 'UY' },
    { id: '21', name: 'Venezuela', code: 'VE' }
  ];

  constructor(private http: HttpClient) { }

  /**
   * Get all countries from API
   */
  getCountries(): Observable<Country[]> {
    const url = `${this.apiUrl}/countries`;
    return this.http.get<Country[]>(url).pipe(
      catchError(error => {
        console.warn('Failed to fetch countries from API, using fallback data:', error);
        return of(this.fallbackCountries);
      })
    );
  }

  /**
   * Get country by ID
   */
  getCountryById(id: string): Observable<Country | undefined> {
    const url = `${this.apiUrl}/countries/${id}`;
    return this.http.get<Country>(url).pipe(
      catchError(error => {
        console.warn('Failed to fetch country from API:', error);
        return of(this.fallbackCountries.find(c => c.id === id));
      })
    );
  }
}
