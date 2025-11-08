import { randomUUID } from "node:crypto";
import { err, ok, Result } from "neverthrow";
import { isUUID } from "../utils";

// TaskId
export type TaskId = string & { readonly __brand: "TaskId" };

export function TaskId(id?: string): Result<TaskId, ValidationError> {
	const value = id ?? randomUUID();
	if (value.length === 0) {
		return err({
			type: "ValidationError",
			message: "IDは空にできません",
		});
	}
	if (!isUUID(value)) {
		return err({
			type: "ValidationError",
			message: "IDの形式が不正です。UUID形式である必要があります。",
		});
	}
	return ok(value as TaskId);
}

// Title
export type Title = string & { readonly __brand: "Title" };

export function Title(title: string): Result<Title, ValidationError> {
	if (title.length === 0) {
		return err({
			type: "ValidationError",
			message: "タイトルを入力してください",
		});
	}
	return ok(title as Title);
}

// Status
export type Status = ("todo" | "in progress" | "completed" | "canceled") & {
	readonly __brand: "Status";
};

export function Status(status: string): Result<Status, ValidationError> {
	const validStatuses = ["todo", "in progress", "completed", "canceled"];
	if (!validStatuses.includes(status)) {
		return err({
			type: "ValidationError",
			message: "無効なステータスです",
		});
	}
	return ok(status as Status);
}

// Task
export type Task = Readonly<{
	id: TaskId;
	title: Title;
	status: Status;
}>;

export type ValidationError = { type: "ValidationError"; message: string };

export function Task(titleValue: string): Result<Task, ValidationError> {
	const taskIdResult = TaskId();
	const titleResult = Title(titleValue);
	const statusResult = Status("todo");

	return Result.combine([taskIdResult, titleResult, statusResult]).map(
		([id, title, status]) => {
			return { id, title, status };
		},
	);
}

export function UpdateTask(
	task: Task,
	titleValue?: string,
	statusValue?: string,
): Result<Task, ValidationError> {
	titleValue = titleValue ?? task.title;
	statusValue = statusValue ?? task.status;

	const title = Title(titleValue);
	const status = Status(statusValue);

	return Result.combine([title, status]).map(([title, status]) => ({
		...task,
		title,
		status,
	}));
}
