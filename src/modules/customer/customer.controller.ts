import { FastifyReply, FastifyRequest } from "fastify";
import {
  createCustomer,
  findCustomerByEmail,
  getCustomers,
} from "./customer.service";
import { CreateCustomerRequest, LoginRequest } from "./customer.schema";
import { verifyPassword } from "../../utils/hash";
import { server } from "../../app";

export async function registerCustomerHandler(
  request: FastifyRequest<{
    Body: CreateCustomerRequest;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const customer = await createCustomer(body);
    return reply.code(201).send(customer);
  } catch (ex) {
    return reply.code(501).send({
      error: "Internal Server Error",
      message: ex,
    });
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginRequest;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  // find customer by email id
  const customer = await findCustomerByEmail(body.email);
  if (!customer) {
    return reply.code(401).send({
      message: "Email id doesn't exist",
    });
  }

  // verify password
  const success = await verifyPassword(body.password, customer.hashPassword);
  if (!success) {
    return reply.code(400).send({
      message: "Wrong password has been provided",
    });
  }

  // generate and return jwt token
  const { hashPassword, ...rest } = customer;
  return { accessToken: server.jwt.sign(rest) };
}

export async function getCustomersHandler() {
  return await getCustomers();
}
