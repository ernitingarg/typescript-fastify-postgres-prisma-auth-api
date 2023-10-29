import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { CreateCustomerRequest } from "./customer.schema";

export async function createCustomer(input: CreateCustomerRequest) {
  const { password, ...rest } = input;
  const hashedPassword = await hashPassword(password);

  const customer = await prisma.customer.create({
    data: { ...rest, hashPassword: hashedPassword },
  });

  return customer;
}

export async function findCustomerByEmail(email: string) {
  return await prisma.customer.findUnique({
    where: {
      email: email,
    },
  });
}

export async function getCustomers() {
  // This is to return fields at prisma level (another way is to use schema)
  return await prisma.customer.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
