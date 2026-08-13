import { z } from "@hono/zod-openapi";
import type { TPaginationMeta } from "$types/common";

export const ApiResponse = <
	T extends z.ZodType,
	U extends z.ZodType<TPaginationMeta>,
>(
	data?: T,
	metadata?: U,
) => {
	const ResponseSchema = z.object({
		status: z.enum(["success", "error", "async-error", "async-success"]),
		message: z.string().optional(),
	});

	return ResponseSchema.extend({
		data: data ?? z.null(),
		metadata: (metadata ?? PaginationMeta).optional(),
	});
};

export const UUIDv7Param = (
	customValidator?: Parameters<typeof z.refine<string>>[0],
	options?: Parameters<typeof z.refine<string>>[1],
) =>
	z
		.object({
			id: customValidator
				? z.uuidv7().refine((id) => {
						try {
							return customValidator(id);
						} catch (error) {
							console.error(error);

							return false;
						}
					}, options)
				: z.uuidv7(),
		})
		.openapi({
			example: { id: "019abe0d-897a-7000-b421-60f0f1777e78" },
			param: { in: "path", name: "id" },
		});

export const PaginationMeta = z.object({
	page: z.number().int().positive(),
	limit: z.number().int().positive(),
	total_counts: z.number().int().nonnegative(),
	total_pages: z.number().int().positive(),
	has_next: z.boolean(),
	has_prev: z.boolean(),
});
