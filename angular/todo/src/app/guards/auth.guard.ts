import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
    const router = inject(Router);
    const localSession = JSON.parse(window.localStorage.getItem('sb-ksrrqdsagxlaijrlqqzx-auth-token') || '{}')

    if (localSession?.access_token) {
        return true;
    }

    // Redirect to the login page
    return router.parseUrl('/login');
};
