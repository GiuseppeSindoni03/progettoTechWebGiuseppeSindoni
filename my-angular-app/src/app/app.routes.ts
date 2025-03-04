import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },  // ✅ Deve essere la home page!
    { path: 'register', component: RegistrationComponent },
    { path: 'home', component: HomePageComponent }
];
