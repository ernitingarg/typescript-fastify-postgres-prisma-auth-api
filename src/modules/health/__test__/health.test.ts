import { test } from "tap";
import buildServer from "../../../server";

test("GET /api/health test", async (t) => {
  const fastify = buildServer();

  t.teardown(() => fastify.close());

  const response = await fastify.inject({
    method: "GET",
    url: "/api/health",
  });

  t.equal(200, response.statusCode);
  t.same({ status: "OK" }, response.json());
});

test("GET /api/health/db test", async (t) => {
  const fastify = buildServer();

  t.teardown(() => fastify.close());

  const response = await fastify.inject({
    method: "GET",
    url: "/api/health/db",
  });

  t.equal(200, response.statusCode);
  t.same({ status: "DB Conn OK" }, response.json());
});
