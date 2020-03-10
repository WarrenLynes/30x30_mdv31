import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as tasksActions from './tasks.actions';
import { Task } from '@mdv31/core-data';

export const TASKS_FEATURE_KEY = 'tasks';

export interface TasksState extends EntityState<Task> {
  selectedTaskId?: string | number;
  isLoading: boolean;
}

export interface TasksPartialState {
  readonly [TASKS_FEATURE_KEY]: TasksState;
}

export const tasksAdapter: EntityAdapter<Task> = createEntityAdapter<Task>();

export const initialState: TasksState = tasksAdapter.getInitialState({
  selectedTaskId: null,
  isLoading: false
});

const _reducer = createReducer(
  initialState,
  on(tasksActions.taskSelected, (state, { selectedTaskId }) =>
    Object.assign({}, state, { selectedTaskId })
  ),
  on(tasksActions.tasksLoaded, (state, { tasks }) =>
    tasksAdapter.addAll(tasks, { ...state, isLoading: false })
  ),
  on(tasksActions.taskCreated, (state, { task }) =>
    tasksAdapter.addOne(task, { ...state, isLoading: false })
  ),
  on(tasksActions.taskUpdated, (state, { task }) =>
    tasksAdapter.upsertOne(task, { ...state, isLoading: false })
  ),
  on(tasksActions.taskDeleted, (state, { taskId }) =>
    tasksAdapter.removeOne(taskId, { ...state, isLoading: false })
  ),
  on(
    tasksActions.loadTasks,
    tasksActions.createTask,
    tasksActions.updateTask,
    tasksActions.deleteTask,
    (state) => ({
      ...state,
      isLoading: true
    })
  ),
);

export function reducer(state: TasksState | undefined, action: Action) {
  return _reducer(state, action);
}
