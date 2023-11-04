import { FastifyInstance } from "fastify";
import {
  getCustomersHandler,
  loginHandler,
  registerCustomerHandler,
} from "./customer.controller";
import { $ref } from "./customer.schema";

async function customerRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createCustomerRequestSchema"),
        response: {
          201: $ref("createCustomerResponseSchema"),
        },
      },
    },
    registerCustomerHandler
  );

  server.post(
    "/login",
    {
      schema: {
        body: $ref("loginRequestSchema"),
        response: {
          201: $ref("loginResponseSchema"),
        },
      },
    },
    loginHandler
  );

  server.get(
    "/",
    {
      // this token authentication should related to admin to list all customers
      preHandler: [server.authenticate],
    },
    getCustomersHandler
  );
}

export default customerRoutes;
