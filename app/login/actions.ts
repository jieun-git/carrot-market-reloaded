"use server";

import { any, z } from "zod";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";

const formScheme = z.object({
  email: z.string().email().toLowerCase(),
  password: z
    .string({
      required_error: "Password is required!",
    })
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

const handleLogin = async (prevState: any, formData: FormData) => {
  console.log(prevState);
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = formScheme.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
};

export { handleLogin };
