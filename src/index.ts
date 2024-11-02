import { Elysia } from "elysia";
import { jwtConfig } from "@/libs/jwt";
import prismadb from "@/libs/prismadb";
import authRoutes from "./routes/auth";
import cors from "@elysiajs/cors";

const port = process.env.PORT || 1863;

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
    (app) =>
      app.get("/me", async ({ auth_user }) => {
        if (auth_user) {
          const uid = auth_user.uid.toString();
          const foundUser = await prismadb.user.findUnique({
            where: { id: uid },
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
            },
          });
          return {
            status: 200,
            msg: "Success Retrieving User's Profile",
            metadata: foundUser,
          };
        } else {
          return { status: 500, msg: "Internal Server Error" };
        }
      })
  )
  .use(authRoutes);

app.listen(port);

console.log(`Running at ${app.server?.hostname}:${app.server?.port}`);
