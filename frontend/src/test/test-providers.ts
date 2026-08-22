import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../app/core/api-base-url.token';


export const testProviders = [
  provideHttpClient(),
  provideHttpClientTesting(),
  { provide: API_BASE_URL, useValue: 'http://localhost:3000/api' },
];