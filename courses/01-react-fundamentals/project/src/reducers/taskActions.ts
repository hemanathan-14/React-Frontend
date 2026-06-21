import type { Task } from "../components/TaskList";
import type { TaskAction } from "./taskReducer";

import {
  ADD_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  TOGGLE_TASK,
  SET_TASKS,
} from "./taskReducer";

export const addTask = (
  task: Task
): TaskAction => ({
  type: ADD_TASK,
  payload: task,
});

export const updateTask = (
  id: string | number,
  updates: Partial<Task>
): TaskAction => ({
  type: UPDATE_TASK,
  payload: { id, ...updates },
});

export const deleteTask = (
  id: string | number
): TaskAction => ({
  type: DELETE_TASK,
  payload: id,
});

export const toggleTask = (
  id: string | number
): TaskAction => ({
  type: TOGGLE_TASK,
  payload: id,
});

export const setTasks = (
  tasks: Task[]
): TaskAction => ({
  type: SET_TASKS,
  payload: tasks,
});