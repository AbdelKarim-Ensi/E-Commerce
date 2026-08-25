import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { API_BASE_URL } from './core/api-base-url.token';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: API_BASE_URL,
      useValue:
        process.env['API_URL_SSR'] || 'https://techgear-backend-ekrc.onrender.com/api',
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);