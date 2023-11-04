import { faker } from "@faker-js/faker";
import { test } from "tap";
import buildServer from "../../../server";
import { UserType } from "@fastify/jwt";

test("POST api/customers/login", async () => {
  test("Login with correct credentials", async (t) => {
    const name = faker.internet.userName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    const fasitfy = buildServer();

    t.teardown(() => {
      fasitfy.close();
    });

    // Create customer
    const resposneCreatedCustomer = await fasitfy.inject({
      method: "POST",
      url: "/api/customers",
      payload: {
        name,
        email,
        password,
      },
    });
    const id = resposneCreatedCustomer.json().id;
    t.equal("string", typeof id);

    //Login
    const response = await fasitfy.inject({
      method: "POST",
      url: "/api/customers/login",
      payload: {
        email,
        password,
      },
    });

    t.equal(200, response.statusCode);
    const accessToken = response.json().accessToken;
    t.equal("string", typeof accessToken);

    const verified = fasitfy.jwt.verify<UserType & { iat: number }>(
      accessToken
    );
    t.equal(name, verified.name);
    t.equal(email, verified.email);
    t.equal(id, verified.id);
    t.equal("number", typeof verified.iat);
  });

  test("Login with wrong credentials", async (t) => {
    const name = faker.internet.userName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    const fasitfy = buildServer();

    t.teardown(() => {
      fasitfy.close();
    });

    // Create customer
    const resposneCreatedCustomer = await fasitfy.inject({
      method: "POST",
      url: "/api/customers",
      payload: {
        name,
        email,
        password,
      },
    });
    const id = resposneCreatedCustomer.json().id;
    t.equal("string", typeof id);

    //Login with wrong password
    const response = await fasitfy.inject({
      method: "POST",
      url: "/api/customers/login",
      payload: {
        email,
        password: "wrong",
      },
    });

    t.equal(400, response.statusCode);
    const errorMessage = response.json();

    t.equal(
      "Wrong password has been provided",
      errorMessage.message,
      "Mismatch in error message"
    );
  });
});
