import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { err, ok, type Result } from "neverthrow";
import type { task } from "../domain";
import type { NetworkErr, NotFoundErr, Repository } from "./types";

type Task = task;
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
	createTask(task: task): Result<task, NetworkErr> {
		// 異常ケースの動作確認のため、タイトルが "NG" の場合にエラーを返す
		if (task.title !== "NG") {
			db.data.tasks.push(task);
			db.write();
			return ok(task);
		} else {
			return err({
				type: "NetworkError",
				message: "ネットワークエラーです。しばらく待って。",
			});
		}
	}

	getTask(id: string): Result<task, NotFoundErr> {
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
}
