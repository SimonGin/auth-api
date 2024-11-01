import bcrypt from "bcrypt";
import prismadb from "../libs/prismadb";
import { RegisterReqBody, LoginReq } from "../types";

const saltRounds = 10;

export const register = async (body: RegisterReqBody) => {
  try {
    const { name, email, password } = body;

    const existedUser = await prismadb.user.findUnique({ where: { email } });

    if (existedUser) {
      return { status: 422, msg: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prismadb.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { status: 200, msg: "User created successfully", data: newUser };
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req: LoginReq) => {
  try {
    const { email, password } = req.body;

    const foundUser = await prismadb.user.findUnique({ where: { email } });
    if (!foundUser) {
      return { status: 401, msg: "Invalid email" };
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatch) {
      return { status: 401, msg: "Invalid password" };
    }

    const token = await req.jwt_auth.sign({ uid: foundUser.id });

    return {
      status: 200,
      msg: "Login successful",
      metadata: { access_token: token },
    };
  } catch (error) {
    console.log(error);
    return { status: 500, msg: "Internal server error" };
  }
};
