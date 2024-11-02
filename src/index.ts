import { Elysia } from "elysia";
import { jwtConfig } from "@/libs/jwt";
import authRoutes from "./routes/auth";
import cors from "@elysiajs/cors";

const app = new Elysia()
  .use(cors())
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
  .use(authRoutes);

app.listen(1863);

console.log(`Running at ${app.server?.hostname}:${app.server?.port}`);
