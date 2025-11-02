import { Result, ok, err } from "neverthrow";
import type { task } from "../domain/task.js";

// TODO: DB立ててPrismaで書く
let tasksTable: task[] = [
	{
		id: "1",
		title: "タスク1",
		status: "todo",
	},
];

export type RepositoryErr = NetworkErr;

export type NetworkErr = {type: "NetworkError", message: string};

export class Repository {
	createTask = (task: task): Result<task, RepositoryErr> => {
		tasksTable.push(task);
		// return ok(task);
    return err({type: "NetworkError", message: "ネットワークエラーです。しばらく待って。"})
	};
}
