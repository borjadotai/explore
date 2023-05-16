import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Todo } from 'src/app/interfaces/todo';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
  task: FormControl = new FormControl();
  rows: number = 1

  @Input() todo: Todo | undefined
  @Output() editTodo: EventEmitter<void> = new EventEmitter<void>()
  @Output() toggleDone: EventEmitter<void> = new EventEmitter<void>()

  ngOnInit() {
    this.task.setValue(this.todo?.task)
    this.rows = (this.todo?.task.length || 41) > 45 ? 2 : 1
    if (this.todo?.is_archived) this.task.disable()
  }

  scrollUp() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

}
