"use server";
import { z } from "zod"; // 백엔드에서 유효성 검사를 하기 유용한 라이브러리

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/,
);

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
      .trim()
      .transform((username) => `🔥 ${username} 🔥`)
      .refine(checkUsername, "No potato allowed!"),
    email: z.string().email().trim().toLowerCase(),
    password: z
      .string()
      .min(4)
      .regex(
        passwordRegex,
        "A passwords must contain at least one UPPERCASE, lowercase, number and special characters.",
      ),
    confirm_password: z.string().min(4),
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

  const result = formScheme.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
};

export { createAccount };
