import type { Context, Next } from "hono";
import { $config, setConfig } from "$constants/config";
import type { TAppBinding } from "$types/common";

export const loadConfig = async (c: Context<TAppBinding>, next: Next) => {
	if (!$config || Object.keys($config).length === 0)
		setConfig({
			...c.env,
			ALLOWED_ADDITIONAL_ORIGINS:
				c.env.ALLOWED_ADDITIONAL_ORIGINS?.split(",").filter(Boolean) || [],
		});

	await next();
};
