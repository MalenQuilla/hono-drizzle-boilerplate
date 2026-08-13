// biome-ignore-all lint/complexity/noExcessiveLinesPerFunction: combined relations into one function for better management
import { defineRelations } from "drizzle-orm";
import * as schemas from "./schemas";

export const relations = defineRelations(schemas, (r) => ({
	user: {
		accounts: r.many.account(),
		sessions: r.many.session(),
	},
	session: {
		user: r.one.user({
			from: r.session.userId,
			to: r.user.id,
		}),
	},
	account: {
		user: r.one.user({
			from: r.account.userId,
			to: r.user.id,
		}),
	},
}));
