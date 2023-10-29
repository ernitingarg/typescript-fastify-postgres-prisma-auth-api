import fastifyJwt, { JWT } from "@fastify/jwt";
import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import env from "./utils/config";
import customerRoutes from "./modules/customer/customer.route";
import { customerSchemas } from "./modules/customer/customer.schema";
import productRoutes from "./modules/product/product.route";
import { productSchemas } from "./modules/product/product.schema";

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
  interface FastifyInstance {
    authenticate: any;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: string;
      email: string;
      name: string;
    };
  }
}

function buildServer() {
  const server = Fastify({
    logger: true,
  });

  server.register(fastifyJwt, {
    secret: env.JWT_SECRET_KEY || "",
  });

  server.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (error) {
        reply.send(error);
      }
    }
  );

  server.addHook("preHandler", (req, reply, next) => {
    req.jwt = server.jwt;
    return next();
  });

  server.get("/healthcheck", async function () {
    return { status: "OK" };
  });

  for (const schema of [...customerSchemas, ...productSchemas]) {
    server.addSchema(schema);
  }

  server.register(customerRoutes, { prefix: "api/customers" });
  server.register(productRoutes, { prefix: "api/products" });

  return server;
}

export default buildServer;
