import type { Result } from "neverthrow";
import type { task } from "../domain/task.js";

export type RepositoryErr = NetworkErr;

export type NetworkErr = { type: "NetworkError"; message: string };

export interface Repository {
	createTask(task: task): Result<task, RepositoryErr>;
}
