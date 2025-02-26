/*
 * intercept route
 * 기존 페이지와 같은 구조이며 폴더이름에 (..)를 붙여주면 intercept 라우팅이 가능함
 * .. -> 상대경로 처럼 부모 레벨로 가는 것임 여기서는 app 레벨. (tabs) 는 디렉토리지만 괄호안에 있으므로 보이지 않음.
 * 만약에 같은 레벨에 있는 페이지를 인터셉트하고 싶다면 (.) 가 됨
 * Next 는 우리가 그 라우트를 인터셉트하고 싶은 걸 알고 app/home/(..)products/[id]/page.tsx 를 보여주고,
 * 새로고침하면 app/products/[id]/page.tsx 페이지를 보여줌
 * */
import { UserIcon } from "@heroicons/react/24/solid";
import BackButton from "@/components/back-button";
import db from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatToWon } from "@/lib/utils";

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(Number(params.id));
  return {
    title: product?.title,
  };
}

export default async function Modal({ params }: { params: { id: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const id = Number(resolvedParams.id);
  if (isNaN(id)) {
    return notFound();
  }

  const product = await getProduct(id);

  return (
    <div
      className="absolute w-full h-full
    z-50 flex justify-center items-center
     bg-black bg-opacity-60 left-0 top-0"
    >
      <BackButton />
      <div className="max-w-screen-sm h-1/2 flex justify-center w-full">
        <div
          className="aspect-square
         bg-neutral-700 text-neutral-200 rounded-md flex justify-center items-center"
        >
          <div className="flex">
            <Image
              width={300}
              height={300}
              className="object-cover rounded-md"
              src={product?.photo as string}
              alt={product?.title as string}
            />
            <div className="flex flex-col justify-center items-center">
              <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
                <div className="size-10 overflow-hidden rounded-full">
                  {product?.user.avatar !== null ? (
                    <Image
                      src={product?.user.avatar as string}
                      width={40}
                      height={40}
                      alt={product?.user.username as string}
                    />
                  ) : (
                    <UserIcon />
                  )}
                </div>
                <h3>{product?.user.username}</h3>
              </div>
              <div className="p-5 ">
                <h1 className="text-2xl font-semibold">{product?.title}</h1>
                <p>{product?.description}</p>
              </div>
              <span className="font-semibold text-xl p-5">
                {formatToWon(product?.price as number)}원
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
