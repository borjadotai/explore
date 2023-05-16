import { Component } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthSession, Session } from '@supabase/supabase-js'
import { SupabaseService } from 'src/app/services/supabase.service'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  loading = false
  sent = false

  signInForm = this.formBuilder.group({
    email: '',
  })

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly supabase: SupabaseService,
  ) { }

  ngOnInit() {
    this.supabase.authChanges((e, s) => s?.access_token && this.router.navigate(['/home']))
  }

  async onSubmit(): Promise<void> {
    try {
      this.loading = true
      const email = this.signInForm.value.email as string
      const { error } = await this.supabase.signIn(email)
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.signInForm.reset()
      this.loading = false
      this.sent = true
    }
  }
}