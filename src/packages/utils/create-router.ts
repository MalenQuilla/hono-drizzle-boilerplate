import { validationDefaultHook } from "@app/controller";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { TAppBinding, THonoInit } from "$types/common";

export default (params?: THonoInit) =>
	new OpenAPIHono<TAppBinding>({
		strict: false,
		defaultHook: validationDefaultHook,
		...params,
	});
