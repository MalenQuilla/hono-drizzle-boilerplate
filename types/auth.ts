import type { SignUpDTO } from "^auth/dto";
import type { z } from "@hono/zod-openapi";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { RolesEnum } from "$enums";
import type { account, session, user } from "~drizzle/schemas";

export type TInsertUser = InferInsertModel<typeof user>;
export type TUser = Omit<InferSelectModel<typeof user>, "role"> & {
	role: RolesEnum;
};
export type TUserSession = InferSelectModel<typeof session>;

export type TAccount = InferSelectModel<typeof account>;

export type TSignUp = z.infer<typeof SignUpDTO>;
