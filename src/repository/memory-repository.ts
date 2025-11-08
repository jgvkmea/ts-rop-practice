import { err, ok, type Result } from "neverthrow";
import type { Task } from "../domain";
import type { Repository, RepositoryErr } from "./types";

const tasksTable: Task[] = [
	{
		id: "1",
		title: "タスク1",
		status: "todo",
	},
];

export class MemoryRepository implements Repository {
	createTask(task: Task): Result<Task, RepositoryErr> {
		// 異常ケースの動作確認のため、タイトルが "NG" の場合にエラーを返す
		if (task.title !== "NG") {
			tasksTable.push(task);
			return ok(task);
		} else {
			return err({
				type: "NetworkError",
				message: "ネットワークエラーです。しばらく待って。",
			});
		}
	}
}
