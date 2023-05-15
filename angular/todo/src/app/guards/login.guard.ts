import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const loginGuard = () => {
    const router = inject(Router);
    const localSession = JSON.parse(window.localStorage.getItem('sb-ksrrqdsagxlaijrlqqzx-auth-token') || '{}')

    if (localSession?.access_token) {
        return router.parseUrl('/home');
    }

    // Redirect to the login page
    return true;
};
