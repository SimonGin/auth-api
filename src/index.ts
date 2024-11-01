import { Elysia, t } from "elysia";

import { register } from "./ctrlers";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .post("/user/register", ({ body }) => register(body), {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String(),
    }),
  })
  .post("/user/login", () => {
    return { success: true };
  })
  .post("/user/logout", () => {
    return { success: true };
  });

app.listen(1863);

console.log(`Running at ${app.server?.hostname}:${app.server?.port}`);
