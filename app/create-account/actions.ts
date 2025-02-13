"use server";
import { z } from "zod"; // 백엔드에서 유효성 검사를 하기 유용한 라이브러리
import {
  PASSWORD_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import bcrypt from "bcrypt";

import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkUsername = (username: string) => !username.includes("potato");
const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => confirm_password === password;

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
      .trim(),
      // .transform((username) => `🔥 ${username} 🔥`)
    email: z.string().email().trim().toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH),
      // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
    .superRefine(async({ username }, ctx) => {
        const user = await db.user.findUnique({
            where: {
                username
            }, select: {
                id: true
            }
        })

        if (user) {
            ctx.addIssue({
                code: 'custom',
                message: 'This username is already taken.',
                path: ['username'],
                fatal: true
            })

            // username 에서 유효성 검사에 실패하면 다른 유효성 검사는 진행하지 않음.
            return z.NEVER
        }
    })
    .superRefine(async({ email }, ctx) => {
        const user = await db.user.findUnique({
            where: {
                email
            }, select: {
                id: true
            }
        })

        if (user) {
            ctx.addIssue({
                code: 'custom',
                message: 'This email is already taken.',
                path: ['email'],
                fatal: true
            })

            // email 에서 유효성 검사에 실패하면 다른 유효성 검사(이 후의 refine())는 진행하지 않음.
            return z.NEVER
        }
    })
    .refine(checkPassword, {
        // superRefine 에서 error 발생 시 실행되지 않음.
        message: "Both password should be the same",
        path: ["confirm_password"],
    })

const createAccount = async (prevState: any, formData: FormData) => {
    const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  const result = await formScheme.safeParseAsync(data);
  if (!result.success) {
      console.log(result.error.flatten());
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

      const session = await getSession()

      session.id = user.id
      await session.save()
      redirect('/profile')
  }
};

export { createAccount };
