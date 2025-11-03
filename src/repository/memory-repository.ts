import { Result, ok, err } from "neverthrow";
import type { task } from "../domain/task.js";
import type { Repository, RepositoryErr } from "./types.js";

let tasksTable: task[] = [
	{
		id: "1",
		title: "タスク1",
		status: "todo",
	},
];

export class MemoryRepository implements Repository {
	createTask(task: task): Result<task, RepositoryErr> {
		tasksTable.push(task);
		return ok(task);
		// return err({type: "NetworkError", message: "ネットワークエラーです。しばらく待って。"})
	}
}
