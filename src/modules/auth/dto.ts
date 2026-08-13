import { z } from "@hono/zod-openapi";
import { createSelectSchema } from "drizzle-orm/zod";
import { user } from "~drizzle/schemas";

export const SignUpDTO = z
	.object({
		email: z.email(),
		image: z.url().optional(),
		username: z.string().trim().min(2).max(32),
		displayUsername: z.string().trim().min(2).max(32).optional(),
		password: z.string().trim().min(8).max(100),
		rememberMe: z.boolean().default(true),
		callbackUrl: z.preprocess((value) => {
			if (typeof value === "string" && value === "") return;

			return value;
		}, z.url().optional()),
	})
	.openapi("SignUpDTO");

export const UserDTO = createSelectSchema(user);
