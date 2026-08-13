import healthcheck from "^healthcheck";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { $config } from "$constants/config";
import configDocs from "$helpers/config-docs";
import { loadConfig } from "$middlewares/config";
import createRouter from "$utils/create-router";
import { error, notFound } from "./controller";
import appRouter from "./route";

const app = createRouter();

app
	// Middlewares
	.use(loadConfig)
	.use("*", (c, next) =>
		cors({
			origin: $config.ALLOWED_ADDITIONAL_ORIGINS,
			credentials: true,
		})(c, next),
	)
	.use(logger())
	// Route handlers
	.route("/healthcheck", healthcheck)
	.route("/api", appRouter)
	// Error handlers
	.notFound(notFound)
	.onError(error);

configDocs(app);

export default app;
