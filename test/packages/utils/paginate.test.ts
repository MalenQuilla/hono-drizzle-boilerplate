import { describe, expect, it } from "vitest";

import { paginateFrom } from "$utils/paginate";

describe("paginateFrom", () => {
	it("returns the first page of 25 items with next and no prev", () => {
		const result = paginateFrom([1, 2, 3], 25, { page: 1, limit: 10 });

		expect(result.metadata).toEqual({
			total_counts: 25,
			total_pages: 3,
			page: 1,
			limit: 10,
			has_next: true,
			has_prev: false,
		});
	});

	it("returns a middle page with both next and prev", () => {
		const result = paginateFrom([1, 2, 3], 25, { page: 2, limit: 10 });

		expect(result.metadata).toEqual({
			total_counts: 25,
			total_pages: 3,
			page: 2,
			limit: 10,
			has_next: true,
			has_prev: true,
		});
	});

	it("returns the last page with prev and no next", () => {
		const result = paginateFrom([1, 2, 3], 25, { page: 3, limit: 10 });

		expect(result.metadata.total_pages).toBe(3);
		expect(result.metadata.has_next).toBe(false);
		expect(result.metadata.has_prev).toBe(true);
	});

	it("returns one page with no next or prev when total is 0", () => {
		const result = paginateFrom([], 0, { page: 1, limit: 10 });

		expect(result.data).toEqual([]);
		expect(result.metadata).toEqual({
			total_counts: 0,
			total_pages: 1,
			page: 1,
			limit: 10,
			has_next: false,
			has_prev: false,
		});
	});

	it("rounds a partial last page up to a full page count", () => {
		const result = paginateFrom([1], 21, { page: 3, limit: 10 });

		expect(result.metadata.total_pages).toBe(3);
		expect(result.metadata.has_next).toBe(false);
	});

	it("does not clamp an out-of-range page", () => {
		const result = paginateFrom([], 25, { page: 5, limit: 10 });

		expect(result.metadata.total_pages).toBe(3);
		expect(result.metadata.has_next).toBe(false);
		expect(result.metadata.has_prev).toBe(true);
	});

	it("passes the data array through by reference", () => {
		const data = [{ id: "a" }, { id: "b" }];

		const result = paginateFrom(data, 2, { page: 1, limit: 10 });

		expect(result.data).toBe(data);
	});
});
