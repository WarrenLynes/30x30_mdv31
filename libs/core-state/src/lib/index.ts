import { ActionReducerMap } from '@ngrx/store';

import * as fromTasks from './tasks/tasks.reducer';

export interface AppState {
  tasks: fromTasks.TasksState;
}

export const reducers: ActionReducerMap<AppState> = {
  tasks: fromTasks.reducer
};

export const defaultState: AppState = {
  tasks: {ids: [] } as fromTasks.TasksState
};
