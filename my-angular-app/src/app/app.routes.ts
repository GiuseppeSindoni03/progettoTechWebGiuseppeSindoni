import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthGuard } from './guards/auth.guard';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { IdeaPageComponent } from './pages/idea-page/idea-page.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },  
    { path: 'register', component: RegistrationComponent },
    { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
    { path: 'me', component: UserPageComponent, canActivate: [AuthGuard]},
    { path: "idea/:id", component: IdeaPageComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];
