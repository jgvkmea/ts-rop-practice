import type { Result } from "neverthrow";
import { Task, UpdateTask, type ValidationError } from "../domain/task";
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

export interface updateTaskWorkflowCommand {
	input: {
		id: string;
		title?: string;
		status?: string;
	};
	repository: Repository;
}

export function updateTaskWorkflow(
	command: updateTaskWorkflowCommand,
): Result<Task, NotFoundErr | NetworkErr | ValidationError> {
	return command.repository
		.getTask(command.input.id)
		.andThen((task) =>
			UpdateTask(task, command.input.title, command.input.status),
		)
		.andThen((updatedTask) => command.repository.updateTask(updatedTask));
}
