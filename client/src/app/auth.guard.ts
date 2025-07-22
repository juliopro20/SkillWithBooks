import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Check if the user is logged in
    if (authService.isLoggedIn()) {
        console.log('User is logged in, access granted.');
        return true; // Allow access to the route
    } else {
        console.log('User not logged in, redirecting to login.');
        router.navigate(['/login']); // Redirect to login
        return false; // Deny access
    }
};