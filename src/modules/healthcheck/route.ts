import { ApiResponse } from "@app/dto";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpCode from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

const tags = ["Default"];

export const get = createRoute({
	method: "get",
	path: "/",
	tags,
	responses: {
		[HttpCode.OK]: jsonContent(
			ApiResponse(z.string().openapi({ example: "Hello <IP address>!" })).omit({
				message: true,
			}),
			"Health check",
		),
	},
});

export type TGetRoute = typeof get;
