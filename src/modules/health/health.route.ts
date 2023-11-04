import { FastifyInstance } from "fastify";
import prisma from "../../utils/prisma";

async function healthRoutes(server: FastifyInstance) {
  server.get("/", async function () {
    return { status: "OK" };
  });

  server.get("/db", async function () {
    return { status: prisma ? "DB Conn OK" : "DB Conn Failed" };
  });
}

export default healthRoutes;
