import { FastifyInstance } from "fastify";
import { createProductHandler, getProductsHandler } from "./product.controller";
import { $ref } from "./product.schema";

async function productRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      // this token authentication should related to customer to allow product creation
      preHandler: [server.authenticate],
      schema: {
        body: $ref("createProductRequestSchema"),
        response: {
          201: $ref("createProductResponseSchema"),
        },
      },
    },
    createProductHandler
  );

  server.get(
    "/",
    {
      // this token authentication should related to admin to list all products from all customers
      preHandler: [server.authenticate],
    },
    getProductsHandler
  );
}

export default productRoutes;
