import type { Context } from "hono";
import {
	type createTaskWorkflowInput,
	createTaskWorkflow,
} from "../workflows/index.js";

export async function createTaskHandler(c: Context) {
	const { title } = await c.req.json();

	const input: createTaskWorkflowInput = {
		title,
	};

	return createTaskWorkflow(input).match(
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
