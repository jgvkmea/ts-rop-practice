import type { Result, ResultAsync } from "neverthrow";
import { Task, TaskId, updateTask, type ValidationError } from "../domain/task";
import type { NetworkErr, NotFoundErr, Repository } from "../repository/index";

// Create Task Workflow
interface createTaskWorkflowInput {
	title: string;
}

export interface createTaskWorkflowCommand {
	input: createTaskWorkflowInput;
	repository: Repository;
}

export function createTaskWorkflow(
	command: createTaskWorkflowCommand,
): ResultAsync<Task, NetworkErr | ValidationError> {
	return Task(command.input.title).asyncAndThen(command.repository.createTask);
}

// Get Task Workflow
interface getTaskWorkflowInput {
	id: string;
}

export interface getTaskWorkflowCommand {
	input: getTaskWorkflowInput;
	repository: Repository;
}

export function getTaskWorkflow(
	command: getTaskWorkflowCommand,
): Result<Task, ValidationError | NotFoundErr> {
	return TaskId(command.input.id).andThen(command.repository.getTask);
}

// Update Task Workflow
interface updateTaskWorkflowInput {
	id: string;
	title?: string;
	status?: string;
}

export interface updateTaskWorkflowCommand {
	input: updateTaskWorkflowInput;
	repository: Repository;
}

export function updateTaskWorkflow(
	command: updateTaskWorkflowCommand,
): ResultAsync<Task, NotFoundErr | ValidationError> {
	return TaskId(command.input.id)
		.andThen(command.repository.getTask)
		.andThen((task) =>
			updateTask(task, command.input.title, command.input.status),
		)
		.asyncAndThen(command.repository.updateTask);
}

// Delete Task Workflow
interface deleteTaskWorkflowInput {
	id: string;
}

export interface deleteTaskWorkflowCommand {
	input: deleteTaskWorkflowInput;
	repository: Repository;
}

export function deleteTaskWorkflow(
	command: deleteTaskWorkflowCommand,
): ResultAsync<string, ValidationError | NetworkErr> {
	return TaskId(command.input.id)
		.asyncAndThen(command.repository.deleteTask)
		.map(() => command.input.id);
}
