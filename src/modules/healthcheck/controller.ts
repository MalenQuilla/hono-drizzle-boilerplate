import { getConnInfo } from "hono/cloudflare-workers";
import type { TAppRouteHandler } from "$types/common";
import type { TGetRoute } from "./route";

export const get: TAppRouteHandler<TGetRoute> = (c) => {
	const info = getConnInfo(c);
	return c.json({
		status: "success",
		data: `Hello ${info.remote.address}!`,
	});
};
