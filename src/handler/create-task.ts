import type { Context } from "hono";
import {
	type createTaskWorkflowInput,
	createTaskWorkflow,
} from "../workflows/index.js";
import { z } from "zod";
import { type Result, ok, err } from "neverthrow";

export type ValidationError = { type: "ValidationError"; message: string };

export async function createTaskHandler(c: Context) {
	return (await createTaskHandlerInput(c)).andThen(createTaskWorkflow).match(
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

async function createTaskHandlerInput(
	c: Context,
): Promise<Result<createTaskWorkflowInput, ValidationError>> {
	const body = await c.req.json();
	const result = CreateTaskRequest.safeParse(body);

	if (!result.success) {
		return err({
			type: "ValidationError",
			message: result.error.message,
		});
	}

	return ok({
		title: result.data.title,
	});
}
