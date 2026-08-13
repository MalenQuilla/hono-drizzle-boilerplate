// biome-ignore-all lint/complexity/noBannedTypes: use {} as type definition before override

import { z } from "@hono/zod-openapi";
import { OrderEnum } from "$enums";

export const RangeSchema = (startSchema: z.ZodNumber, endSchema: z.ZodNumber) =>
	z
		.object({
			start: startSchema.optional(),
			end: endSchema.optional(),
		})
		.optional()
		.superRefine((val, ctx) => {
			if (!val) return;

			const { start, end } = val;

			if (!start || !end || start <= end) return;

			ctx.addIssue({
				code: "custom",
				message: "start must be less than or equal to end",
			});
		});

export type TPaginationQuery = z.infer<typeof PaginationQuery>;

export type TZodQueryBuilder<
	T extends z.ZodRawShape = {},
	U extends z.ZodRawShape = {},
> = ReturnType<typeof zodQueryBuilder<T, U>>;

/* ------------------------------------------------------------- */

const PaginationQuery = z.object({
	page: z.coerce
		.number()
		.int()
		.positive()
		.default(1)
		.openapi({
			param: {
				name: "page",
				in: "query",
				description: "Page number",
			},
			example: 1,
		}),
	limit: z.coerce
		.number()
		.int()
		.positive()
		.default(10)
		.openapi({
			param: {
				name: "limit",
				in: "query",
				description: "Number of items per page",
			},
			example: 10,
		}),
});

const OrderQuery = (description?: string) =>
	z.object({
		order: z
			.enum(OrderEnum)
			.default(OrderEnum.ASC)
			.openapi({
				param: {
					name: "order",
					in: "query",
					description: description ?? "Order",
				},
			}),
	});

const SearchQuery = (description?: string) =>
	z.object({
		search: z
			.string()
			.trim()
			.optional()
			.openapi({
				param: {
					name: "search",
					in: "query",
					description: description ?? "Search",
				},
			}),
	});

export const zodQueryBuilder = <
	TShape extends z.ZodRawShape = {},
	UShape extends z.ZodRawShape = {},
>() => {
	let extender: TShape = {} as TShape;

	let paginable: boolean = false;

	let searchable: boolean = false;
	let searchableDescription: string | undefined;

	let orderable: boolean = false;
	let orderableDescription: string | undefined;

	const builder = {
		extend: <NShape extends TShape>(shape: NShape) => {
			extender = shape;

			return builder as TZodQueryBuilder<NShape, UShape>;
		},
		paginable: () => {
			paginable = true;

			return builder as TZodQueryBuilder<
				TShape,
				UShape & typeof PaginationQuery.shape
			>;
		},
		searchable: (searchDescription?: string) => {
			searchable = true;
			searchableDescription = searchDescription;

			return builder as TZodQueryBuilder<
				TShape,
				UShape & ReturnType<typeof SearchQuery>["shape"]
			>;
		},
		orderable: (orderDescription?: string) => {
			orderable = true;
			orderableDescription = orderDescription;

			return builder as TZodQueryBuilder<
				TShape,
				UShape & ReturnType<typeof OrderQuery>["shape"]
			>;
		},
		build: () => {
			const query = z.object(extender);

			const [pagination, search, order] = [
				paginable ? PaginationQuery.shape : {},
				searchable ? SearchQuery(searchableDescription).shape : {},
				orderable ? OrderQuery(orderableDescription).shape : {},
			] as UShape[];

			return query
				.extend(pagination)
				.extend(search)
				.extend(order)
				.transform((query) => {
					type TEitherPaginated = UShape extends typeof PaginationQuery.shape
						? { offset: number }
						: {};

					return {
						...query,
						...(paginable
							? {
									offset:
										((query as TPaginationQuery).page - 1) *
										(query as TPaginationQuery).limit,
								}
							: {}),
					} as z.Infer<z.ZodObject<TShape & UShape>> & TEitherPaginated;
				});
		},
	};

	return builder;
};
