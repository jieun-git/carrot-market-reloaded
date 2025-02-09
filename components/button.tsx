// useFormStatus
// 훅은 React 에서 기본으로 제공해주는 form action 관련 훅
// 반드시 form 의 자식 컴포넌트 내부에서만 호출이 됨. form 이 있는 곳에서 호출되지 않음

"use client";

import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
}

export default function Button({ text }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="primary-btn h-10
      disabled:bg-neutral-400
      disabled:text-neutral-300 disabled:cursor-not-allowed"
    >
      {pending ? "로딩 중..." : text}
    </button>
  );
}
