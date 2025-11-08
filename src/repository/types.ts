import type { Result } from "neverthrow";
import type { Task } from "../domain";

export type NetworkErr = { type: "NetworkError"; message: string };
export type NotFoundErr = { type: "NotFoundError"; message: string };

export interface Repository {
	createTask(task: Task): Result<Task, NetworkErr>;
	getTask(id: string): Result<Task, NotFoundErr>;
}
