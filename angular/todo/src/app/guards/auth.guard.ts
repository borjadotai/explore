import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard = () => {
    const supabase = inject(SupabaseService);
    const router = inject(Router);
    const localSession = JSON.parse(window.localStorage.getItem('sb-ksrrqdsagxlaijrlqqzx-auth-token') || '{}')
    const session = supabase.session

    if (localSession?.access_token) {
        console.log('getting through to home')
        return true;
    }

    // Redirect to the login page
    console.log('didnt have session and so auth sent to login')
    return router.parseUrl('/login');
};
