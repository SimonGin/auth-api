import bcrypt from "bcrypt";
import prismadb from "../libs/prismadb";
import { RegisterReqBody } from "../types";

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
