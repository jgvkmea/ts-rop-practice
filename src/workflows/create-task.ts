import type { Result } from "neverthrow";
import { task, type ValidationError } from "../domain/task.js";
import { createTask, type RepositoryErr } from "../repository/index.js";

export interface createTaskWorkflowInput {
	title: string;
}

export function createTaskWorkflow(
	input: createTaskWorkflowInput,
): Result<task, RepositoryErr | ValidationError> {
	return task(input.title).andThen(createTask);
}
