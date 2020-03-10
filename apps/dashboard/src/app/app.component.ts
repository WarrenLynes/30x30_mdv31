import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TasksFacade } from '../../../../libs/core-state/src/lib/tasks/tasks.facade';
import { emptyTask, Task } from '@mdv31/core-data';
import { Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'mdv31-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject();
  form: FormGroup;
  tasks$ = this.tasksFacade.allTasks$;
  task$ = this.tasksFacade.selectedTask$;

  constructor(
    private tasksFacade: TasksFacade
  ) { this.buildForm(); }

  ngOnInit(): void {
    this.tasksFacade.loadTasks();
    this.tasksFacade.selectedTask$.pipe(
      takeUntil(this.destroy$),
      filter((x) => x && x.id !== null),
      tap((x) => this.buildForm(x))
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  buildForm(x=emptyTask) {
    this.form = new FormGroup({
      id: new FormControl(x.id),
      name: new FormControl(x.name),
      description: new FormControl(x.description)
    })
  }

  onCancel() {
    this.form.reset();
    this.tasksFacade.selectTask(null);
  }

  onDelete() {
    this.form.reset();
    this.tasksFacade.selectTask(null);
  }

  saveTask() {
    const task = this.form.value;

    if(task) {
      if (task.id) {
        this.tasksFacade.updateTask(task);
      } else { this.tasksFacade.createTask(task); }
    }

    this.onSelectTask(null);
    this.form.reset();
  }

  onSelectTask(taskId) {
    this.tasksFacade.selectTask(taskId);
  }
}
