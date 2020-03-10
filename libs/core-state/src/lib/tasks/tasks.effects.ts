import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { map, tap } from 'rxjs/operators';

import { TasksFacade } from './tasks.facade';
import * as tasksActions from './tasks.actions';
import { Task, TasksService} from '@mdv31/core-data';
import { TasksPartialState } from './tasks.reducer';
import { throwError } from 'rxjs';

@Injectable()
export class TasksEffects {
  loadTasks$ = createEffect(() =>
    this.dataPersistence.fetch(tasksActions.loadTasks, {
      run: (
        action: ReturnType<typeof tasksActions.loadTasks>,
        state: TasksPartialState
      ) => this.tasksService.all().pipe(
        map((tasks: Task[]) => tasksActions.tasksLoaded({ tasks: tasks})),
      ),
      onError: (action: ReturnType<typeof tasksActions.loadTasks>, error) => {
        console.error('Effect Error:', error);
        return throwError(error);
      }
    })
  );

  addTask$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(tasksActions.createTask, {
      run: (
        action: ReturnType<typeof tasksActions.createTask>,
        state: TasksPartialState
      ) => this.tasksService.create(action.task).pipe(
        map((task: any) => tasksActions.taskCreated({ task })),
      ),
      onError: (action: ReturnType<typeof tasksActions.createTask>, error) => {
        console.log('Effect Error:', error);
        return throwError(error);
      }
    })
  );

  updateTask$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(tasksActions.updateTask, {
      run: (
        action: ReturnType<typeof tasksActions.updateTask>,
        state: TasksPartialState
      ) => this.tasksService.update(action.task).pipe(
        map((task: Task) => tasksActions.taskUpdated({ task })),
      ),
      onError: (action: ReturnType<typeof tasksActions.updateTask>, error) => {
        console.log('Effect Error:', error);
        return throwError(error);
      }
    })
  );

  deleteTask$ = createEffect(() =>
    this.dataPersistence.pessimisticUpdate(tasksActions.deleteTask, {
      run: (
        action: ReturnType<typeof tasksActions.deleteTask>,
        state: TasksPartialState
      ) => this.tasksService.delete(action.taskId).pipe(
        map((taskId: any) => tasksActions.taskDeleted({taskId})),
        tap(() => this.tasksFacade.loadTasks()),
      ),
      onError: (action: ReturnType<typeof tasksActions.deleteTask>, error) => {
        console.log('Effect Error:', error);
        return throwError(error);
      }
    })
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<TasksPartialState>,
    private tasksService: TasksService,
    private tasksFacade: TasksFacade
  ) {}
}
