export interface Task {
  id: number;
  name: string;
  description: string;
}

export const emptyTask: Task = {
  id: null,
  name: '',
  description: ''
};
