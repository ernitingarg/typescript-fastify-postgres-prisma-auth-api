import z from "zod";
import { buildJsonSchemas } from "fastify-zod";

const emailRequestValidation = {
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email()
    .refine((email) => email.trim() === email, {
      message: "Email cannot have leading or trailing spaces",
    }),
};

const nameRequestValidation = {
  name: z.string({
    required_error: "Name is required",
  }),
};

const passwordRequestValidation = {
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .refine((pass) => pass.length >= 8, {
      message: "Password must be atleast 8 characters long",
    })
    .refine((pass) => /[A-Z]/.test(pass), {
      message: "Password must contain atleast one uppercase letter",
    })
    .refine((pass) => /\d/.test(pass), {
      message: "Password must container atleast one digit",
    })
    .refine((pass) => /\W_/.test(pass), {
      message: "Password must contain atleast one special character",
    }),
};

const createCustomerRequestSchema = z.object({
  ...emailRequestValidation,
  ...nameRequestValidation,
  ...passwordRequestValidation,
});

const createCustomerResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const loginRequestSchema = z.object({
  ...emailRequestValidation,
  ...passwordRequestValidation,
});

const loginResponseSchema = z.object({
  access_token: z.string(),
});

export type CreateCustomerRequest = z.infer<typeof createCustomerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const { schemas: customerSchemas, $ref } = buildJsonSchemas(
  {
    createCustomerRequestSchema,
    createCustomerResponseSchema,
    loginRequestSchema,
    loginResponseSchema,
  },
  { $id: "CustomerSchemas" }
);
