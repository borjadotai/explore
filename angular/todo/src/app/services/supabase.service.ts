import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import { environment } from '../../environment/environment'
import { Todo } from '../interfaces/todo'

export interface Profile {
  id?: string
  username: string
  website: string
  avatar_url: string
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient
  _session: AuthSession | null = null

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session
    })
    return this._session
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: '/home' } })
  }

  signOut() {
    this.supabase.auth.signOut()
    return this.router.navigate(['/login'])
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    }

    return this.supabase.from('profiles').upsert(update)
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path)
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file)
  }

  fetchTodos() {
    return this.supabase.from('todos').select().order('created_at', { ascending: true })
  }

  addTodo(task: string) {
    const userId = this._session?.user.id
    return this.supabase.from('todos').insert({ task, user_id: userId }).select()
  }

  toggleDone(id: string, isDone: boolean) {
    return this.supabase
      .from('todos')
      .update({ is_done: !isDone })
      .eq('id', id)
      .single()
  }

  archiveTodos(ids: string[]) {
    return Promise.all(ids.map(id => this.supabase.from('todos').update({ is_archived: true, is_done: false }).eq('id', id)))
  }

  editTodo(id: string, task: string) {
    return this.supabase
      .from('todos')
      .update({ task })
      .eq('id', id)
      .single()
  }
}