import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Todo } from 'src/app/interfaces/todo';
import { SupabaseService } from 'src/app/services/supabase.service';

type Filters = "archived" | "active" | "done"

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  loading: boolean = false
  filter: Filters = "active";
  todos: any[] = []
  allTodos: any[] = []
  errorText: string | undefined | null

  constructor(private supabase: SupabaseService) { }

  ngOnInit(): void {
    this.fetchTodos()
  }

  async fetchTodos(): Promise<void> {
    this.loading = true
    let { data: todos, error } = await this.supabase.fetchTodos()
    if (error) {
      console.error('error', error.message)
    } else {
      this.allTodos = todos ?? []
      this.filterTodos(this.filter)
      this.loading = false
    }
  }

  filterTodos(filter: Filters) {
    if (filter == 'done') this.todos = this.allTodos.filter(t => t['is_done'])
    if (filter == 'active') this.todos = this.allTodos.filter(t => !t['is_done'] && !t['is_archived'])
    if (filter == 'archived') this.todos = this.allTodos.filter(t => t['is_archived'])
  }

  changeFilter(filter: Filters) {
    this.filter = filter
    this.filterTodos(filter)
  }

  async addTodo(task: string): Promise<void> {
    if (task.length <= 3) {
      this.errorText = 'Task length should be more than 3!'
    } else {
      let { data, error } = await this.supabase.addTodo(task)
      if (error) {
        this.errorText = error.message
      } else {
        this.todos = [...this.todos, data?.[0]]
        this.errorText = null
      }
    }
  }

  async toggleDone(id: string, isDone: boolean): Promise<void> {
    try {
      await this.supabase.toggleDone(id, isDone)
      this.todos = this.todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, is_done: !isDone }
        }
        return todo
      })
      this.fetchTodos()
    } catch (error) {
      console.error(error)
    }
  }

  async archiveTodos(todo: Todo[]): Promise<void> {
    try {
      await this.supabase.archiveTodos(todo.map(todo => todo.id))
      this.todos = this.todos.filter(todo => !todo.is_archived)
      this.fetchTodos()
    } catch (error) {
      console.error(error)
    }
  }

  async editTodo(id: string, task: void): Promise<void> {
    try {
      await this.supabase.editTodo(id, task as unknown as string)
      this.todos = this.todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, task }
        }
        return todo
      })
    } catch (error) {
      console.error(error)
    }
  }

}
