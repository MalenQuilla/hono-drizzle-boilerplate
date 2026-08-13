import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import * as HttpCode from "stoker/http-status-codes";
import * as HttpMsg from "stoker/http-status-phrases";
import type { RolesEnum } from "$enums";
import { $auth } from "$libs/auth";
import type { TUser, TUserSession } from "$types/auth";
import type { TAppBinding } from "$types/common";

export const authenticate: MiddlewareHandler<TAppBinding> = async (c, next) => {
	const session = await $auth().api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session)
		throw new HTTPException(HttpCode.UNAUTHORIZED, {
			message: HttpMsg.UNAUTHORIZED,
		});

	c.set("user", session.user as TUser);
	c.set("session", session.session as TUserSession);

	return next();
};

export const authorize =
	(...roles: `${RolesEnum}`[]): MiddlewareHandler<TAppBinding> =>
	(c, next) => {
		const user = c.get("user");

		if (!roles.includes(user.role as RolesEnum))
			throw new HTTPException(HttpCode.FORBIDDEN, {
				message: HttpMsg.FORBIDDEN,
			});

		return next();
	};
