import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from 'src/app/interfaces/todo';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})

export class TodoComponent {
  editable = false;

  @Input() todo!: Todo;
  @Output() remove = new EventEmitter<Todo>();

  saveTodo(description: string) {
    if (!description) return;
    this.editable = false;
    this.todo.description = description;
  }
}
