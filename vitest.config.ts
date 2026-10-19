import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const fromRoot = (path: string) =>
	fileURLToPath(new URL(path, import.meta.url));

// Mirrors tsconfig.json "paths". "$types/" must stay before "$".
export default defineConfig({
	resolve: {
		alias: [
			{ find: /^\$types\//, replacement: fromRoot("./types/") },
			{ find: /^@app\//, replacement: fromRoot("./src/app/") },
			{ find: /^\$/, replacement: fromRoot("./src/packages/") },
			{ find: /^\^/, replacement: fromRoot("./src/modules/") },
			{ find: /^~/, replacement: fromRoot("./src/database/") },
		],
	},
	test: {
		environment: "node",
		globals: false,
		include: ["src/**/*.test.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "lcov"],
			reportsDirectory: "coverage",
			include: ["src/**/*.ts"],
			exclude: [
				"src/**/*.test.ts",
				"src/database/drizzle/schemas/**",
				"src/database/migrations/**",
			],
		},
	},
});
