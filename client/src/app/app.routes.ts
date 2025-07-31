import { Routes } from '@angular/router';
import { authGuard } from './auth.guard'; 
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./pages/landingpage/landingpage.component') },
    { path: 'login', loadComponent: () => import('./pages/login/login.component') },
    { path: 'register', loadComponent: () => import('./pages/register/register.component') },
    { path: 'forget-password', loadComponent: () => import('./pages/forget-password/forget-password.component') },
    { path: 'reset/:token', loadComponent: () => import('./pages/reset/reset.component') },
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component'),
        canActivate: [authGuard]  // Protecting this route
    },
    {
        path: 'profile/:id',
        component: ProfileComponent,
        canActivate: [authGuard]  // Protecting this route
    },
    { path: '**', redirectTo: '' } // Redirect unknown paths to landing page
];