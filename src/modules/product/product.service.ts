import prisma from "../../utils/prisma";
import { CreateProductRequest } from "./product.schema";

export async function createProduct(
  data: CreateProductRequest & { ownerId: string }
) {
  return prisma.product.create({
    data,
  });
}

export async function getProducts() {
  return await prisma.product.findMany({
    include: {
      owner: {
        select: { name: true },
      },
    },
  });
}
