import type { Context } from "hono";
import {
	type createTaskWorkflowInput,
	createTaskWorkflow,
} from "../workflows/index.js";
import type { ValidationError } from "../domain/task.js";

// 型ガード関数：ValidationErrorかどうかを判定
function isValidationError(e: unknown): e is ValidationError {
	return (
		typeof e === "object" &&
		e !== null &&
		"type" in e &&
		e.type === "ValidationError"
	);
}

export async function createTaskHandler(c: Context) {
	const { title } = await c.req.json();

	const input: createTaskWorkflowInput = {
		title,
	};

	return createTaskWorkflow(input).match(
		(value) => {
			return c.json(value);
		},
		(e) => {
			if (isValidationError(e)) {
				return c.json({ message: e.message }, 400);
			}
			return c.json({ message: "Internal Server Error" }, 500);
		},
	);
}
