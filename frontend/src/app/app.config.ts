import { ApplicationConfig, provideBrowserGlobalErrorListeners, inject, provideAppInitializer } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { ssrCookieInterceptor } from './core/interceptors/ssr-cookie.interceptor';
import { AuthService } from './core/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from './core/api-base-url.token';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([ssrCookieInterceptor, authInterceptor])),
    { provide: API_BASE_URL, useValue: environment.apiUrl },
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return firstValueFrom(authService.checkSession());
    }),
  ]
};