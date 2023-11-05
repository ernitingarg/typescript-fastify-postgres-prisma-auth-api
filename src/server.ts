import fastifyJwt, { JWT } from "@fastify/jwt";
import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import env from "./utils/config";
import customerRoutes from "./modules/customer/customer.route";
import { customerSchemas } from "./modules/customer/customer.schema";
import productRoutes from "./modules/product/product.route";
import { productSchemas } from "./modules/product/product.schema";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { version } from "../package.json";
import healthRoutes from "./modules/health/health.route";
import { logger } from "./utils/logger";

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
    logger: logger,
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

  server.addHook("preHandler", (req, _reply, next) => {
    req.jwt = server.jwt;
    return next();
  });

  for (const schema of [...customerSchemas, ...productSchemas]) {
    server.addSchema(schema);
  }

  // Register swagger documentation
  const swaggerOptions = {
    swagger: {
      info: {
        title: "Auth API",
        description: "API documentation for auth api",
        version: version,
      },
      schemes: ["http", "https"],
    },
  };

  const swaggerUiOptions = {
    routePrefix: "/docs",
    exposeRoute: true,
  };

  server.register(fastifySwagger, swaggerOptions);
  server.register(fastifySwaggerUi, swaggerUiOptions);
  server.register(healthRoutes, { prefix: "api/health" });
  server.register(customerRoutes, { prefix: "api/customers" });
  server.register(productRoutes, { prefix: "api/products" });

  return server;
}

export default buildServer;
