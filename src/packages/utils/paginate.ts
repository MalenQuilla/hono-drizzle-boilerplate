import type { TPaginationQuery } from "$libs/zod";
import type { TPaginated } from "$types/common";

export const paginateFrom = <T, U extends TPaginationQuery>(
	data: T[],
	total: number,
	opts: U,
): TPaginated<T> => {
	const { page, limit } = opts;

	const totalPages = Math.max(1, Math.ceil(total / limit));
	const has_next = page < totalPages;
	const has_prev = page > 1;

	return {
		data,
		metadata: {
			total_counts: total,
			total_pages: totalPages,
			page,
			limit,
			has_next,
			has_prev,
		},
	};
};
