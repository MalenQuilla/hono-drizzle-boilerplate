import { Scalar } from "@scalar/hono-api-reference";
import { cache } from "hono/cache";
import { merge } from "lodash";
import { $config } from "$constants/config";
import type { TAppOpenAPI } from "$types/common";
import packageJSON from "../../../package.json";
import deserializeAuthDoc from "./deserialize-auth-doc";

export default async (app: TAppOpenAPI) => {
	app
		.get(
			"/openapi",
			cache({
				cacheName: "api-docs",
				cacheControl: "max-age=3600", // 1 hours
			}),
			async (c) => {
				const authDoc = await deserializeAuthDoc();
				const appDoc = app.getOpenAPI31Document({
					openapi: "3.1.0",
					servers: [
						{
							url: $config.BETTER_AUTH_URL,
							description: "Production server",
						},
						{
							url: "http://localhost:8787",
							description: "Local development server",
						},
					],
					info: {
						title: packageJSON.name,
						version: packageJSON.version,
						description: `OpenAPI document for ${packageJSON.name}`,
					},
				});

				return c.json(merge(authDoc, appDoc));
			},
		)
		.get(
			"/docs",
			Scalar({
				url: "/openapi",
				theme: "bluePlanet",
				defaultHttpClient: {
					targetKey: "shell",
					clientKey: "curl",
				},
			}),
		);
};
