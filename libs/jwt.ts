import { jwt } from "@elysiajs/jwt";

const JWT_SECRET = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

export const jwtConfig = jwt({
  name: "jwt_auth",
  secret: JWT_SECRET,
});
