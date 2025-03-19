import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { provideToastr } from 'ngx-toastr';
import { CommonModule } from '@angular/common';


import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    ReactiveFormsModule,
    importProvidersFrom( 
      CommonModule
    ),
    provideToastr(),

  
  ]
};
