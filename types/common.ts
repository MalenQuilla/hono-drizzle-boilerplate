import type { PaginationMeta } from "@app/dto";
import type {
	OpenAPIHono,
	OpenAPIHonoOptions,
	RouteConfig,
	RouteHandler,
	z,
} from "@hono/zod-openapi";
import type { RelationsFilter } from "drizzle-orm";
import type { Hono } from "hono";
import type { $db } from "~drizzle";
import type { relations } from "~drizzle/relations";
import type { TUser, TUserSession } from "./auth";

export type TAppBinding = {
	Variables: {
		user: TUser;
		session: TUserSession;
		studentId: string | undefined;
		parentId: string | undefined;
		teacherId: string | undefined;
	};
	Bindings: Env;
};

export type THonoInit = ConstructorParameters<typeof Hono>[0] &
	OpenAPIHonoOptions<TAppBinding>;

export type TAppOpenAPI = OpenAPIHono<TAppBinding>;

export type TAppRouteHandler<
	R extends RouteConfig,
	T extends TAppBinding = TAppBinding,
> = RouteHandler<R, T>;

export type TTransactionHost = Parameters<
	Parameters<ReturnType<typeof $db>["transaction"]>[0]
>[0];

export type TTransactionBuilder<T> = {
	transaction: (tx: TTransactionHost) => TTransactionBuilder<T>;
	exec: () => Promise<T>;
};

export type TPaginationMeta = z.infer<typeof PaginationMeta>;

export type TPaginated<T> = {
	data: T[];
	metadata: TPaginationMeta;
};

export type TConfig = Omit<Env, "ALLOWED_ADDITIONAL_ORIGINS"> & {
	ALLOWED_ADDITIONAL_ORIGINS: string[];
};

export type TWhereConditions<T extends keyof typeof relations> =
	RelationsFilter<(typeof relations)[T], typeof relations>;
