import type { Result } from "neverthrow";
import { task, type ValidationError } from "../domain/task.js";
import { Repository, type RepositoryErr } from "../repository/index.js";

export interface createTaskWorkflowInput {
	title: string;
}

export function createTaskWorkflow(
	input: createTaskWorkflowInput,
): Result<task, RepositoryErr | ValidationError> {
	const repo = new Repository();

	return task(input.title).andThen(repo.createTask);
}
