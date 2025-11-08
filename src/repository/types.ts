import type { Result } from "neverthrow";
import type { task } from "../domain";

export type RepositoryErr = NetworkErr;

export type NetworkErr = { type: "NetworkError"; message: string };

export interface Repository {
	createTask(task: task): Result<task, RepositoryErr>;
}
