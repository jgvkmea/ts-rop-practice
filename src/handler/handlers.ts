import type { Context } from "hono";
import { err, ok, type Result } from "neverthrow";
import { z } from "zod";
import { LowdbRepository } from "../repository";
import {
	createTaskWorkflow,
	type createTaskWorkflowCommand,
	getTaskWorkflow,
	type getTaskWorkflowCommand,
} from "../workflows";

export type ValidationError = { type: "ValidationError"; message: string };

export async function createTaskHandler(c: Context) {
	return (await createTaskHandlerCommand(c)).andThen(createTaskWorkflow).match(
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
): Promise<Result<getTaskWorkflowCommand, ValidationError>> {
	const id = c.req.param("id");

	if (!id) {
		return Promise.resolve(
			err({
				type: "ValidationError",
				message: "IDが指定されていません。",
			}),
		);
	}

	return Promise.resolve(
		ok({
			input: {
				id: id,
			},
			repository: new LowdbRepository(), // TODO: DIちゃんとやる
		}),
	);
}
