import { randomUUID } from "node:crypto";
import { err, ok, type Result } from "neverthrow";

export type task = Readonly<{
	id: string; // TODO: VO定義する
	title: string;
	status: "todo" | "in progress" | "completed" | "canceled";
}>;

export type ValidationError = { type: "ValidationError"; message: string };

export function task(title: string): Result<task, ValidationError> {
	if (title.length <= 0) {
		return err({
			type: "ValidationError",
			message: "タイトルを入力してください",
		});
	}

	return ok({
		id: randomUUID(),
		title,
		status: "todo",
	});
}
