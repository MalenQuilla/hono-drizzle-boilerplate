import authRouter from "^auth";
import { authenticate } from "$middlewares/auth";
import createRouter from "$utils/create-router";

export default createRouter().route("/auth", authRouter).use(authenticate);
//.use(routeThatAuthenticated);
