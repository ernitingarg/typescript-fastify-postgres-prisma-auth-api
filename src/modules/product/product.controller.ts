import { FastifyReply, FastifyRequest } from "fastify";
import { CreateProductRequest } from "./product.schema";
import { createProduct, getProducts } from "./product.service";

export async function createProductHandler(
  request: FastifyRequest<{
    Body: CreateProductRequest;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const product = await createProduct({
      ...body,
      ownerId: request.user.id,
    });

    return reply.code(201).send(product);
  } catch (ex) {
    return reply.code(501).send({
      error: "Internal Server Error",
      message: ex,
    });
  }
}

export async function getProductsHandler() {
  const products = await getProducts();
  return products;
}
