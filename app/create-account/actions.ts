"use server";
import { z } from "zod"; // 백엔드에서 유효성 검사를 하기 유용한 라이브러리
import {
  PASSWORD_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const checkUsername = (username: string) => !username.includes("potato");
const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => confirm_password === password;

const checkUniqueUsername = async (username: string) => {
    const user = await db.user.findUnique({
        where: {
            username: username
        },
        select: {
            id: true
        }
    });
    // already exist username ? false : true
    return !Boolean(user);
}

const checkUniqueEmail = async (email: string) => {
    const user = await db.user.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true
        }
    })
    // already exist email ? false : true
    return !Boolean(user);
}

// 유효성 조건
const formScheme = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string",
        required_error: "Where is my username???",
      })
      .min(3, "Way too short!!")
      .max(10, "Way too long!!")
      .toLowerCase()
      .trim()
      // .transform((username) => `🔥 ${username} 🔥`)
      .refine(checkUsername, "No potato allowed!").refine(checkUniqueUsername, "This username is already taken."),
    email: z.string().email().trim().toLowerCase().refine(checkUniqueEmail, "There is an account already registered with that email."),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH),
      // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .refine(checkPassword, {
    message: "Both password should be the same",
    path: ["confirm_password"],
  });

const createAccount = async (prevState: any, formData: FormData) => {
    const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  const result = await formScheme.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
      /* after zod validation */

      const hashedPassword = await bcrypt.hash(result.data.password, 12)

      const user = await db.user.create({
          data: {
              username: result.data.username,
              email: result.data.email,
              password: hashedPassword
          },
          select: {
              id: true
          }
      })

      const cookiesStore = await cookies()

      const cookie = await getIronSession(cookiesStore, {
          cookieName: 'delicious-carrot',
          password: process.env.COOKIE_PASSWORD!,
      })
      cookie.id = user.id
      await cookie.save()
      redirect('/profile')
  }
};

export { createAccount };
