import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createTaskHandler, getTaskHandler } from "./handler";

const app = new Hono();

app.post("/tasks", (c) => {
	return createTaskHandler(c);
});

app.get("/tasks/:id", (c) => {
	return getTaskHandler(c);
});

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
