import { Elysia, t } from "elysia";
import { register, login } from "./ctrlers";
import { jwtConfig } from "../libs/jwt";
import { LoginReq } from "../types";

const app = new Elysia()
  .use(jwtConfig)
  .derive(async ({ headers, jwt_auth }) => {
    const auth_header = headers["authorization"];
    const token =
      auth_header && auth_header.startsWith("Bearer ")
        ? auth_header.slice(7)
        : null;
    if (!token) return { user: null };
    const auth_user = await jwt_auth.verify(token);
    return { auth_user };
  })
  .guard(
    {
      beforeHandle({ auth_user }) {
        if (!auth_user) {
          return { status: 401, msg: "Unauthorized" };
        }
      },
    },
    (app) => app.get("/", () => "Hello Elysia")
  )
  .post("/auth/register", ({ body }) => register(body), {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String(),
    }),
  })
  .post("/auth/login", (login_req: LoginReq) => login(login_req), {
    body: t.Object({ email: t.String(), password: t.String() }),
  });

app.listen(1863);

console.log(`Running at ${app.server?.hostname}:${app.server?.port}`);
