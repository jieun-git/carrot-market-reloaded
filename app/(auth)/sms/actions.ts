"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";

interface ActionState {
  token: boolean;
}

const phoneScheme = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format",
  );

// core -> 사용자가 input number 타입의 값을 입력하면 string 변환함. 이걸 막기 위해 string 으로 받은걸 강제해서 number 타입으로 검증하는 것.
const tokenScheme = z.coerce.number().min(100000).max(999999);

const smsLogin = async (prevState: ActionState, formData: FormData) => {
  const phone = formData.get("phone");
  const token = formData.get("token");

  if (!prevState.token) {
    const result = phoneScheme.safeParse(phone);

    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      return {
        token: true,
      };
    }
  } else {
    const result = tokenScheme.safeParse(token);

    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      redirect("/");
    }
  }
};

export { smsLogin };
