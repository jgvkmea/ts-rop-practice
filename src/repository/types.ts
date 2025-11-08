import type { Result } from "neverthrow";
import type { task } from "../domain";

export type NetworkErr = { type: "NetworkError"; message: string };
export type NotFoundErr = { type: "NotFoundError"; message: string };

export interface Repository {
	createTask(task: task): Result<task, NetworkErr>;
	getTask(id: string): Result<task, NotFoundErr>;
}
