import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createTaskHandler } from "./handler/create-task.js";

const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.post("/tasks", (c) => {
	return createTaskHandler(c);
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
