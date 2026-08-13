import createRouter from "$utils/create-router";
import * as controllers from "./controller";
import * as routes from "./route";

export default createRouter().openapi(routes.get, controllers.get);
