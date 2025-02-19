import db from "@/lib/db";
import ProductList from "@/components/product-list";
import { Prisma } from "@prisma/client";

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    take: 1,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export default async function Product() {
  const initialProducts = await getInitialProducts();

  return <ProductList initialProducts={initialProducts} />;
}
