import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import env from "./utils/config";
import customerRoutes from "./modules/customer/customer.route";
import { customerSchemas } from "./modules/customer/customer.schema";
import { fastifyJwt } from "@fastify/jwt";

console.log(process.env);

export const server = Fastify({
  logger: true,
});

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}

server.register(fastifyJwt, {
  secret: env.JWT_SECRET_KEY || "",
});

server.get("/healthcheck", async function () {
  return { status: "OK" };
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

async function main() {
  for (const schema of customerSchemas) {
    server.addSchema(schema);
  }

  server.register(customerRoutes, { prefix: "api/customers" });

  try {
    const port = env.PORT ? parseInt(env.PORT) : 3000;
    await server.listen({
      port: port,
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
