import { Component } from '@angular/core';
import { Todo } from 'src/app/interfaces/todo';

type Filters = "all" | "active" | "done"

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  filter: Filters = "active";

  allTodos = [
    { description: "eat", done: true },
    { description: "sleep", done: false },
    { description: "play", done: false },
    { description: "laugh", done: false },
  ];

  get todos() {
    if (this.filter === "all") {
      return this.allTodos;
    }
    return this.allTodos.filter((todo) =>
      this.filter === "done" ? todo.done : !todo.done
    );
  }

  changeFilter(filter: Filters) {
    this.filter = filter
  }

  addItem(description: string) {
    this.allTodos.push({
      description,
      done: false
    });
  }

  remove(todo: Todo) {
    this.allTodos.splice(this.allTodos.indexOf(todo), 1);
  }

}
