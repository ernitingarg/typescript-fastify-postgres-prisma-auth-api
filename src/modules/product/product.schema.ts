import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const productRequest = {
  title: z.string(),
  content: z.string().optional(),
  price: z.number(),
};

const productResponse = {
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  ownerId: z.string(),
};

const createProductRequestSchema = z.object({
  ...productRequest,
});

const createProductResponseSchema = z.object({
  ...productResponse,
  ...productRequest,
});

export type CreateProductRequest = z.infer<typeof createProductRequestSchema>;

export const { schemas: productSchemas, $ref } = buildJsonSchemas(
  {
    createProductRequestSchema,
    createProductResponseSchema,
  },
  { $id: "ProductSchemas" }
);
