import db from "@/lib/db";
import ProductList from "@/components/product-list";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/solid";
import { revalidatePath, unstable_cache as nextCache } from "next/cache";

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export const metadata = {
  title: "Home",
};

const getCachedProducts = nextCache(getInitialProducts, ["home-products"], {
  // NOTE 60초가 지난 후 새로운 요청이 있다면 그때 Next 가 함수 호출
  revalidate: 60,
});

async function getInitialProducts() {
  console.log("hit!!");
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    // take: 1,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export default async function Product() {
  const initialProducts = await getCachedProducts();

  const revalidate = async () => {
    "use server";
    revalidatePath("/home");
  };

  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <form action={revalidate}>
        <button>Revalidate</button>
      </form>
      <Link
        href="/products/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white
          transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
