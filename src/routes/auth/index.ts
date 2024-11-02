import { Elysia, t } from "elysia";

import { register, login } from "./ctrlers";
import { LoginReq } from "@/types";

const authRoutes = new Elysia({ prefix: "/auth" })
  .post("/register", ({ body }) => register(body), {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String(),
    }),
  })
  .post("/login", (login_req: LoginReq) => login(login_req), {
    body: t.Object({ email: t.String(), password: t.String() }),
  });

export default authRoutes;
