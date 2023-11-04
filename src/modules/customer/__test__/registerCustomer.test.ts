import { test } from "tap";
import { faker } from "@faker-js/faker";
import buildServer from "../../../server";
import { ImportMock } from "ts-mock-imports";
import * as customerService from "../customer.service";
import prisma from "../../../utils/prisma";

test("POST /api/customers - Success with Mock", async (t) => {
  const name = faker.internet.userName();
  const email = faker.internet.email();
  const password = faker.internet.password();
  const id = faker.string.uuid();
  const createdAt = faker.date.past().toISOString();
  const updatedAt = faker.date.past().toISOString();

  const fastify = buildServer();

  const stub = ImportMock.mockFunction(customerService, "createCustomer", {
    id,
    email,
    name,
    createdAt,
    updatedAt,
  });

  t.teardown(() => {
    fastify.close();
    stub.restore();
  });

  const response = await fastify.inject({
    method: "POST",
    url: "/api/customers",
    payload: {
      email,
      name,
      password,
    },
  });

  t.equal(201, response.statusCode);
  t.equal("application/json; charset=utf-8", response.headers["content-type"]);

  const json = response.json();
  t.equal(id, json.id, "id should match");
  t.equal(name, json.name, "name should match");
  t.equal(email, json.email, "email should match");
  t.equal(createdAt, json.createdAt, "createdAt should match");
  t.equal(updatedAt, json.updatedAt, "updatedAt should match");
});

test("POST /api/customers - Success with db", async (t) => {
  const name = faker.internet.userName();
  const email = faker.internet.email();
  const password = faker.internet.password();

  const fastify = buildServer();

  t.teardown(async () => {
    fastify.close();
    await prisma.customer.deleteMany();
  });

  const response = await fastify.inject({
    method: "POST",
    url: "/api/customers",
    payload: {
      email,
      name,
      password,
    },
  });

  t.equal(201, response.statusCode);
  t.equal("application/json; charset=utf-8", response.headers["content-type"]);

  const json = response.json();
  t.equal(name, json.name, "name should match");
  t.equal(email, json.email, "email should match");

  t.equal("string", typeof json.id, "id should be a string");
  t.equal("string", typeof json.createdAt, "createdAt should be a string");
  t.equal("string", typeof json.updatedAt, "updatedAt should be a string");
});

test("POST /api/customers - Failed with missing email", async (t) => {
  const name = faker.internet.userName();
  const password = faker.internet.password();

  const fastify = buildServer();

  t.teardown(async () => {
    fastify.close();
    await prisma.customer.deleteMany();
  });

  const response = await fastify.inject({
    method: "POST",
    url: "/api/customers",
    payload: {
      name,
      password,
    },
  });

  t.equal(400, response.statusCode);
  t.equal("application/json; charset=utf-8", response.headers["content-type"]);

  const json = response.json();
  t.equal(
    "body must have required property 'email'",
    json.message,
    "error message is not same."
  );
});
