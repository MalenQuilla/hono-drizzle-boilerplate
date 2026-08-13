import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { $config } from "$constants/config";
import * as schema from "~drizzle/schemas";
import { relations } from "./relations";

let drizzleClient: ReturnType<typeof initClient>;

const initClient = () => {
	const turso = createClient({
		url: $config.TURSO_DATABASE_URL,
		authToken: $config.TURSO_AUTH_TOKEN,
	});

	return drizzle({ client: turso, schema, relations });
};

export const $db = () => {
	if (!drizzleClient) drizzleClient = initClient();

	return drizzleClient;
};
