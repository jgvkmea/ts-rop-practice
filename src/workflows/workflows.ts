import type { Result } from "neverthrow";
import { task, type ValidationError } from "../domain/task";
import type { NetworkErr, NotFoundErr, Repository } from "../repository/index";

interface createTaskWorkflowInput {
	title: string;
}

export interface createTaskWorkflowCommand {
	input: createTaskWorkflowInput;
	repository: Repository;
}

export function createTaskWorkflow(
	command: createTaskWorkflowCommand,
): Result<task, NetworkErr | ValidationError> {
	return task(command.input.title).andThen(command.repository.createTask);
}

interface getTaskWorkflowInput {
	id: string;
}

export interface getTaskWorkflowCommand {
	input: getTaskWorkflowInput;
	repository: Repository;
}

export function getTaskWorkflow(
	command: getTaskWorkflowCommand,
): Result<task, NotFoundErr> {
	return command.repository.getTask(command.input.id);
}
