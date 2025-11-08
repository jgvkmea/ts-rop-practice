import type { Result, ResultAsync } from "neverthrow";
import type { Task, TaskId } from "../domain";

export type NetworkErr = { type: "NetworkError"; message: string };
export type NotFoundErr = { type: "NotFoundError"; message: string };

export interface Repository {
	createTask(task: Task): ResultAsync<Task, NetworkErr>;
	getTask(id: TaskId): Result<Task, NotFoundErr>;
	updateTask(task: Task): ResultAsync<Task, NotFoundErr>;
	deleteTask(id: TaskId): ResultAsync<void, NetworkErr>;
}
