import "tsconfig-paths/register";

import bcrypt from "bcryptjs";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, username } from "better-auth/plugins";
import { HTTPException } from "hono/http-exception";
import * as HttpCode from "stoker/http-status-codes";
import { $config } from "$constants/config";
import { RolesEnum } from "$enums";
import type { TUser } from "$types/auth";
import { $db } from "~drizzle";
import * as auth from "~drizzle/schemas/auth";

const initAuth = () =>
	betterAuth({
		disabledPaths: [
			"/account-info",
			"/delete-user",
			"/delete-user/callback",
			"/error",
			"/forget-password",
			"/get-access-token",
			"/link-social",
			"/list-accounts",
			"/list-sessions",
			"/ok",
			"/refresh-token",
			"/request-password-reset",
			"/reset-password",
			"/reset-password/:token",
			"/revoke-other-sessions",
			"/revoke-session",
			"/revoke-sessions",
			"/send-verification-email",
			"/sign-in/social",
			"/sign-up/email",
			"/unlink-account",
			"/verify-email",
		],
		emailAndPassword: {
			enabled: true,
			password: {
				hash: async (password) => {
					const salt = await bcrypt.genSalt();
					return await bcrypt.hash(password, salt);
				},
				verify: async ({ password, hash }) =>
					await bcrypt.compare(password, hash),
			},
		},
		trustedOrigins: $config.ALLOWED_ADDITIONAL_ORIGINS,
		plugins: [
			username(),
			openAPI({
				disableDefaultReference: true,
			}),
		],
		database: drizzleAdapter($db(), { provider: "sqlite", schema: auth }),
		baseURL: $config.BETTER_AUTH_URL,
		secret: $config.BETTER_AUTH_SECRET,
		user: {
			deleteUser: {
				enabled: true,
				beforeDelete: async (user) => {
					if ((user as TUser).role !== RolesEnum.ADMIN) return;

					throw new HTTPException(HttpCode.BAD_REQUEST, {
						message: "Admin accounts can't be deleted",
					});
				},
			},
			additionalFields: {
				role: {
					type: "string",
					required: true,
				},
			},
		},
	});

let authInstance: ReturnType<typeof initAuth>;

export const $auth = (): ReturnType<typeof initAuth> => {
	if (!authInstance) {
		authInstance = initAuth();
	}

	return authInstance;
};
