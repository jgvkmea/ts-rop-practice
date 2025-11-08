import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { err, ok, type Result, ResultAsync } from "neverthrow";
import type { Task, TaskId } from "../domain";
import type { NetworkErr, NotFoundErr, Repository } from "./types";

type Schema = { tasks: Task[] };

const tasksDefault: Task[] = [];

const adapter = new JSONFile<Schema>("./src/repository/lowdb/db.json");
const db = new Low<Schema>(adapter, { tasks: tasksDefault });

// データベースを初期化する非同期関数
const initializeDb = async () => {
	await db.read();
	// デフォルト値を設定
	db.data ||= { tasks: [] };
	await db.write();
};

await initializeDb();

export class LowdbRepository implements Repository {
	createTask(task: Task): ResultAsync<Task, NetworkErr> {
		return ResultAsync.fromPromise(
			(async () => {
				if (task.title === "NG") {
					// 異常ケースの動作確認のための擬似的なエラーケース
					throw {
						type: "NetworkError",
						message: "ネットワークエラーです。しばらく待って。",
					};
				}

				db.data.tasks.push(task);
				await db.write();
				return task;
			})(),
			(e) => e as NetworkErr,
		);
	}

	getTask(id: TaskId): Result<Task, NotFoundErr> {
		const foundTask = db.data.tasks.find((task) => task.id === id);
		if (foundTask) {
			return ok(foundTask);
		} else {
			return err({
				type: "NotFoundError",
				message: "タスクが見つかりません。",
			});
		}
	}

	updateTask(task: Task): ResultAsync<Task, NotFoundErr> {
		return ResultAsync.fromPromise(
			(async () => {
				const index = db.data.tasks.findIndex((t) => t.id === task.id);
				if (index === -1) {
					throw {
						type: "NotFoundError",
						message: "タスクが見つかりません。",
					};
				}

				db.data.tasks[index] = task;
				await db.write();
				return task;
			})(),
			(e) => e as NotFoundErr,
		);
	}

	deleteTask(id: TaskId): ResultAsync<void, NetworkErr> {
		return ResultAsync.fromPromise(
			(async () => {
				const index = db.data.tasks.findIndex((t) => t.id === id);
				if (index === 2) {
					// 異常ケースの動作確認のための擬似的なエラーケース
					throw {
						type: "NetworkError",
						message: "ネットワークエラーです。しばらく待って。",
					};
				} else if (index !== -1) {
					db.data.tasks.splice(index, 1);
					await db.write();
				}
				return undefined;
			})(),
			(e) => e as NetworkErr,
		);
	}
}
