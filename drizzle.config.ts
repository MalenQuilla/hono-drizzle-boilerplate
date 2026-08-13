import "tsconfig-paths/register";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: [
		"./src/database/drizzle/schemas/index.ts",
		"./src/database/drizzle/relations.ts",
	],
	out: "./src/database/migrations",
	dialect: "turso",
	dbCredentials: {
		//biome-ignore lint/style/noNonNullAssertion: only use when migrate data
		url: process.env.TURSO_DATABASE_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN,
	},
});
