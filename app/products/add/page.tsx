"use client";

import { PhotoIcon } from "@heroicons/react/24/solid";
import Input from "@/components/input";
import Button from "@/components/button";
import React, { useActionState, useState } from "react";
import { uploadProduct } from "@/app/products/add/actions";
export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [state, action] = useActionState(uploadProduct, null);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;

    if (!files) {
      return;
    }

    const file = files[0];

    // 이미지 파일 체크
    if (!file.type.includes("image")) {
      return { error: "이미지 파일만 업로드 할수 있습니다." };
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center
                justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed
                cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {state?.fieldErrors.photo}
              </div>
            </>
          ) : null}
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
          onChange={onImageChange}
        />
        <Input
          name="title"
          required
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          required
          placeholder="가격"
          type="number"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          required
          placeholder="자세한 설명"
          type="text"
          errors={state?.fieldErrors.description}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
