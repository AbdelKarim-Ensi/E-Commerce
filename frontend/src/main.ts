import * as Sentry from '@sentry/angular';
import { bootstrapApplication } from '@angular/platform-browser';
import { mergeApplicationConfig, ApplicationConfig, ErrorHandler } from '@angular/core';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';


if (typeof window !== 'undefined') {
  Sentry.init({
    dsn: environment.sentryDsn,
    environment: environment.production ? 'production' : 'development',
  });
}

const clientConfig: ApplicationConfig = {
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler(),
    },
  ],
};

bootstrapApplication(App, mergeApplicationConfig(appConfig, clientConfig)).catch((err) =>
  console.error(err),
);