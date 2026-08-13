import {
	type Column,
	getColumns,
	type RelationsFilterCommons,
	relationsFilterToSQL,
	type SQL,
	type SQLWrapper,
	sql,
} from "drizzle-orm";
import { CasingCache } from "drizzle-orm/casing";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import type {
	TTransactionBuilder,
	TTransactionHost,
	TWhereConditions,
} from "$types/common";
import { $db } from "~drizzle";
import { relations } from "~drizzle/relations";

export const withTransactionBuilder = <T>(
	fn: (client: ReturnType<typeof $db> | TTransactionHost) => Promise<T>,
): TTransactionBuilder<T> => {
	let client: ReturnType<typeof $db> | TTransactionHost = $db();

	const builder: TTransactionBuilder<T> = {
		transaction: (tx: TTransactionHost) => {
			client = tx;

			return builder;
		},
		exec: async () => await fn(client),
	};

	return builder;
};

export const buildConflictUpdateColumns = <
	T extends SQLiteTable,
	Q extends keyof T["_"]["columns"],
>(
	table: T,
	columns: Q[],
) => {
	const cls = getColumns(table);
	return columns.reduce(
		(acc, column) => {
			const colName = cls[column].name;
			acc[column] = sql.raw(`excluded.${colName}`);
			return acc;
		},
		{} as Record<Q, SQL>,
	);
};

export const buildSqlFromRelationsFilter = <T extends keyof typeof relations>(
	schema: T,
	filters: TWhereConditions<T>,
) =>
	relationsFilterToSQL(
		relations[schema].table,
		filters,
		relations[schema].relations,
		relations,
		new CasingCache(undefined),
	);

export const buildFuzzyFilter = <T extends keyof typeof relations>(
	columns: Array<keyof (typeof relations)[T]["table"]>,
	term: string,
) => {
	return {
		OR: columns.map(
			(c) =>
				({
					RAW: (table) =>
						sql`translit(${table[c]}) LIKE '%' || translit(${term}) || '%'`,
				}) as RelationsFilterCommons<(typeof relations)[T]>,
		),
	} as TWhereConditions<T>;
};

export const fuzzy = (
	column: Column | SQL.Aliased | SQL | SQLWrapper,
	value: string | SQLWrapper,
): SQL => sql`translit(${column}) LIKE '%' || translit(${value}) || '%'`;
