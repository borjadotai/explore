import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const loginGuard = () => {
    const supabase = inject(SupabaseService);
    const router = inject(Router);
    const localSession = JSON.parse(window.localStorage.getItem('sb-ksrrqdsagxlaijrlqqzx-auth-token') || '{}')
    const session = supabase.session

    if (localSession?.access_token && session?.access_token) {
        console.log('redirecting home')
        return router.parseUrl('/home');
    }

    // Redirect to the login page
    console.log('didnt have session and so it went to login')
    return true;
};
