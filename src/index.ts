import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .post("/user/register", () => {
    return { success: true };
  })
  .post("/user/login", () => {
    return { success: true };
  })
  .post("/user/logout", () => {
    return { success: true };
  });

app.listen(3000);

console.log(`Elys is running at ${app.server?.hostname}:${app.server?.port}`);
