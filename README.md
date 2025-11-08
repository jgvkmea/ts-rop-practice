# 関数型スタイルの練習用 API サーバー

## 概要

neverthrow を使って ROP や関数型スタイルの練習をする

## API サーバー

- POST /tasks: タスク作成
- GET /tasks?filter=xxx: タスク一覧取得
- GET /tasks/{id}: タスク取得
- PUT /tasks/{id}: タスク更新
- DELETE /tasks/{id}: タスク削除
- GET /tasks/summary: タスクの完了数、未完了数の統計を取得
