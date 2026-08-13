import type { TConfig } from "$types/common";
import "dotenv/config";

export let $config: TConfig;

// @ts-expect-error
if (process.env.NODE_ENV === "local") $config = process.env;

export const setConfig = (env: TConfig) => {
	$config = env;
};
