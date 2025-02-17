"use client";

import Input from "@/components/input";
import Button from "@/components/button";
import SocialLogin from "@/components/social-login";
import { handleLogin } from "@/app/(auth)/login/actions";
import { useActionState } from "react";
import { PASSWORD_REGEX, PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function Login() {
  const [state, dispatch] = useActionState(handleLogin, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl ">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form className="flex flex-col gap-3" action={dispatch}>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.password}
        />
        <Button text="로그인" />
      </form>
      <SocialLogin />
    </div>
  );
}
