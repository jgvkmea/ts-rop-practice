import type { Result } from "neverthrow";
import { task, type ValidationError } from "../domain/task";
import type { Repository, RepositoryErr } from "../repository/index";

interface createTaskWorkflowInput {
	title: string;
}

export interface createTaskWorkflowCommand {
	input: createTaskWorkflowInput;
	repository: Repository;
}

export function createTaskWorkflow(
	command: createTaskWorkflowCommand,
): Result<task, RepositoryErr | ValidationError> {
	return task(command.input.title).andThen(command.repository.createTask);
}
