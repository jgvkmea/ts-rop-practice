import type { Context } from "hono";
import { err, ok, type Result } from "neverthrow";
import { z } from "zod";
import type { ValidationError } from "../errors";
import { LowdbRepository } from "../repository";
import {
	createTaskWorkflow,
	type createTaskWorkflowCommand,
	deleteTaskWorkflow,
	type deleteTaskWorkflowCommand,
	getTaskWorkflow,
	type getTaskWorkflowCommand,
	updateTaskWorkflow,
	type updateTaskWorkflowCommand,
} from "../workflows";

// Create Task Handler
export async function createTaskHandler(c: Context) {
	return (await createTaskHandlerCommand(c))
		.asyncAndThen(createTaskWorkflow)
		.match(
			(value) => c.json(value),
			(e) => {
				switch (e.type) {
					case "ValidationError":
						return c.json({ message: e.message }, 400);
					case "NetworkError":
						return c.json({ message: e.message }, 503);
					default:
						return c.json({ message: "Internal Server Error" }, 500);
				}
			},
		);
}

const CreateTaskRequest = z.object({
	title: z
		.string()
		.min(1, "titleは空にできません")
		.max(100, "titleは100文字以下にしてください")
		.trim(),
});

async function createTaskHandlerCommand(
	c: Context,
): Promise<Result<createTaskWorkflowCommand, ValidationError>> {
	const body = await c.req.json();
	const result = CreateTaskRequest.safeParse(body);

	if (!result.success) {
		return err({
			type: "ValidationError",
			message: result.error.message,
		});
	}

	return ok({
		input: {
			title: result.data.title,
		},
		repository: new LowdbRepository(), // TODO: DIちゃんとやる
	});
}

// Get Task Handler
export async function getTaskHandler(c: Context) {
	return (await getTaskHandlerCommand(c)).andThen(getTaskWorkflow).match(
		(value) => c.json(value),
		(e) => {
			switch (e.type) {
				case "ValidationError":
					return c.json({ message: e.message }, 400);
				case "NotFoundError":
					return c.json({ message: e.message }, 404);
				default:
					return c.json({ message: "Internal Server Error" }, 500);
			}
		},
	);
}

function getTaskHandlerCommand(
	c: Context,
): Result<getTaskWorkflowCommand, ValidationError> {
	const id = c.req.param("id");

	if (!id) {
		return err({
			type: "ValidationError",
			message: "IDが指定されていません。",
		});
	}

	return ok({
		input: {
			id: id,
		},
		repository: new LowdbRepository(),
	});
}

// Update Task Handler
export async function updateTaskHandler(c: Context) {
	return (await updatedTaskCommand(c)).asyncAndThen(updateTaskWorkflow).match(
		(value) => c.json(value),
		(e) => {
			switch (e.type) {
				case "ValidationError":
					return c.json({ message: e.message }, 400);
				case "NotFoundError":
					return c.json({ message: e.message }, 404);
				default:
					return c.json({ message: "Internal Server Error" }, 500);
			}
		},
	);
}

const UpdateTaskRequest = z.object({
	title: z.string().optional(),
	status: z.string().optional(),
});

async function updatedTaskCommand(
	c: Context,
): Promise<Result<updateTaskWorkflowCommand, ValidationError>> {
	const id = c.req.param("id");
	if (!id) {
		return err({
			type: "ValidationError",
			message: "IDが指定されていません。",
		});
	}

	const body = await c.req.json();
	const result = UpdateTaskRequest.safeParse(body);
	if (!result.success) {
		return err({
			type: "ValidationError",
			message: result.error.message,
		});
	}

	return ok({
		input: {
			id: id,
			title: result.data.title,
			status: result.data.status,
		},
		repository: new LowdbRepository(),
	});
}

// Delete Task Handler
export async function deleteTaskHandler(c: Context) {
	return deleteTaskHandlerCommand(c)
		.asyncAndThen(deleteTaskWorkflow)
		.match(
			(value) => c.json({ id: value }),
			(e) => {
				switch (e.type) {
					case "ValidationError":
						return c.json({ message: e.message }, 400);
					case "NetworkError":
						return c.json({ message: e.message }, 503);
					default:
						return c.json({ message: "Internal Server Error" }, 500);
				}
			},
		);
}

function deleteTaskHandlerCommand(
	c: Context,
): Result<deleteTaskWorkflowCommand, ValidationError> {
	const id = c.req.param("id");
	if (!id) {
		return err({
			type: "ValidationError",
			message: "IDが指定されていません。",
		});
	}

	return ok({
		input: {
			id: id,
		},
		repository: new LowdbRepository(),
	});
}
