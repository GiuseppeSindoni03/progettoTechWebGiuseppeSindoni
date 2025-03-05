import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'; // ✅ Usa withFetch
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import {provideToastr} from 'ngx-toastr';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor.service';
import { CommonModule } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor]) // ✅ Questo aggiunge l'interceptor
    ), // ✅ Questo risolve il problema di HttpClient
    ReactiveFormsModule,
    importProvidersFrom
    (BrowserAnimationsModule, 
      CommonModule
    ),
    provideAnimations(), // ✅ Usa SOLO questo, senza provideAnimationsAsync(),
    provideToastr()
  ]
};
