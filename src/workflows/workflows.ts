import type { Result } from "neverthrow";
import { Task, type ValidationError } from "../domain/task";
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
): Result<Task, NetworkErr | ValidationError> {
	return Task(command.input.title).andThen(command.repository.createTask);
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
): Result<Task, NotFoundErr> {
	return command.repository.getTask(command.input.id);
}
