import type { Context } from "hono";
import {
	type createTaskWorkflowCommand,
	createTaskWorkflow,
} from "../workflows/index.js";
import { z } from "zod";
import { type Result, ok, err } from "neverthrow";
import { MemoryRepository } from "../repository/memory-repository.js";

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
		repository: new MemoryRepository(), // TODO: DIちゃんとやる
	});
}
