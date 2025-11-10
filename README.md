# 関数型スタイルの練習用 API サーバー

## 概要

neverthrow を使って ROP や関数型スタイルの練習をする

## 技術スタック

- **言語**: TypeScript 5.8.3
- **ランタイム**: Node.js
- **Web フレームワーク**: Hono 4.10.4
- **関数型プログラミング**: neverthrow 8.2.0 (Railway-Oriented Programming)
- **バリデーション**: Zod 4.1.12
- **データベース**: lowdb 7.0.1 (JSON ベース)
- **開発ツール**:
  - Biome 2.3.2 (Linter & Formatter)
  - tsx 4.7.1 (TypeScript 実行)
  - Husky 9.1.7 (Git hooks)

## API サーバー

- [x] `POST /tasks`: タスク作成
- [x] `GET /tasks/{id}`: タスク取得
- [x] `PUT /tasks/{id}`: タスク更新
- [x] `DELETE /tasks/{id}`: タスク削除
