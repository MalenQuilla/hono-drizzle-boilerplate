import { $auth } from "$libs/auth";
import createRouter from "$utils/create-router";

export default createRouter().on(["POST", "GET"], "/*", (c) =>
	$auth().handler(c.req.raw),
);
