import { z } from "@hono/zod-openapi";
import { APIError } from "better-auth";
import { TransactionRollbackError } from "drizzle-orm";
import type { ErrorHandler, NotFoundHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { HTTPResponseError } from "hono/types";
import * as HttpCode from "stoker/http-status-codes";
import * as HttpMsg from "stoker/http-status-phrases";
import type { TAppBinding, THonoInit } from "$types/common";

export const notFound: NotFoundHandler<TAppBinding> = (c) =>
	c.json({ status: "error", message: HttpMsg.NOT_FOUND }, HttpCode.NOT_FOUND);

export const error: ErrorHandler<TAppBinding> = (
	err: Error | HTTPResponseError,
	c,
) => {
	console.error(err);

	if (err instanceof APIError) {
		return c.json(
			{ status: "error", message: err.message },
			HttpCode.UNAUTHORIZED,
		);
	}

	if (err instanceof z.ZodError || err.name === z.ZodError.name) {
		return c.json(
			{
				status: "error",
				message: z.prettifyError(err as z.ZodError),
			},
			HttpCode.BAD_REQUEST,
		);
	}

	if (err instanceof TransactionRollbackError) {
		return c.json(
			{ status: "error", message: err.message },
			HttpCode.BAD_REQUEST,
		);
	}

	if (err instanceof HTTPException) {
		return c.json({ status: "error", message: err.message }, err.status);
	}

	return c.json(
		{ status: "error", message: HttpMsg.INTERNAL_SERVER_ERROR },
		HttpCode.INTERNAL_SERVER_ERROR,
	);
};

export const validationDefaultHook: THonoInit["defaultHook"] = (result, c) => {
	if (result.success) return;

	console.error(result.error);

	return c.json(
		{
			status: "error",
			message: z.prettifyError(result.error),
		},
		HttpCode.BAD_REQUEST,
	);
};
