import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'; // ✅ Usa withFetch
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import {provideToastr} from 'ngx-toastr';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()), // ✅ Questo risolve il problema di HttpClient
    ReactiveFormsModule,
    importProvidersFrom(BrowserAnimationsModule),
    provideAnimations(), // ✅ Usa SOLO questo, senza provideAnimationsAsync(),
    provideToastr() 
  ]
};
