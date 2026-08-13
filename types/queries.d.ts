// biome-ignore lint/correctness/noUnusedImports: re-import drizzle types difinition before override
import * as types from "drizzle-orm";

declare module "drizzle-orm" {
	export function relationsFilterToSQL<T extends SchemaEntry>(
		table: T,
		filter: TableFilter<T>,
		tableRelations: RelationsRecord,
		tablesRelations: TablesRelationalConfig,
		casing: CasingCache,
	): SQL | undefined;
}
