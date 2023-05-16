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

  @Input() todo: Todo | undefined
  @Output() editTodo: EventEmitter<void> = new EventEmitter<void>()
  @Output() toggleDone: EventEmitter<void> = new EventEmitter<void>()

  ngOnInit() {
    this.task.setValue(this.todo?.task)
    if (this.todo?.is_archived) this.task.disable()
  }

}
