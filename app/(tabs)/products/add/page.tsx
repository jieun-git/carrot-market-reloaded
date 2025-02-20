"use client";

import { PhotoIcon } from "@heroicons/react/24/solid";
import Input from "@/components/input";
import Button from "@/components/button";
import { useState } from "react";
export default function AddProduct() {
  const [preview, setPreview] = useState("");

  const onImageChange = () => {};

  return (
    <div>
      <form className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center
                justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed
                cursor-pointer"
        >
          <PhotoIcon className="w-20" />
          <div className="text-neutral-400 text-sm">사진을 추가해주세요.</div>
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          className="hidden"
          onChange={onImageChange}
        />
        <Input name="title" required placeholder="제목" type="text" />
        <Input name="price" required placeholder="가격" type="number" />
        <Input
          name="description"
          required
          placeholder="자세한 설명"
          type="text"
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
