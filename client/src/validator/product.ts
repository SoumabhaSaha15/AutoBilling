import { z } from "zod/v3";
import paginatedDocx from "./pagination";
const ProductSchema = z.strictObject({
  productImage: z
    .instanceof(FileList)
    .refine(files => files.length == 1, "Single Product image is required")
    .refine(files => files[0]?.size <= 2 ** 20, `Max image size is 1MB.`) // 1MB limit
    .refine(
      files => ['image/jpeg', 'image/png', 'image/webp'].includes(files[0]?.type),
      "Only .jpg, .png, .webp formats are supported."
    ),
  productName: z
    .string({ required_error: 'product name is required' })
    .regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid product name'),
  brandName: z
    .string({ required_error: 'brand name is required' })
    .regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid brand name'),
  price: z
    .coerce
    .number({ required_error: 'price is required' })
    .int().positive(),
  productDescription: z
    .string({ required_error: "product description is required" })
    .min(10).max(200)
});

export const ProductResponseSchema = ProductSchema.omit({ productImage: true }).extend({
  productImage: z.string().url(),
  id: z.string({ required_error: "id is required." }).length(24).regex(/^[0-9a-fA-F]{24}$/)
});

// Cleaner approach using transform and refine
export const ProductFinder = z.object({
  id: z.string()
    .transform((val) => val.trim() === '' ? undefined : val)
    .optional()
    .refine((val) => !val || /^[0-9a-fA-F]/.test(val), 'invalid id'),

  brandName: z.string()
    .transform((val) => val.trim() === '' ? undefined : val)
    .optional()
    .refine((val) => !val || /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/.test(val), 'invalid brand name'),

  productName: z.string()
    .transform((val) => val.trim() === '' ? undefined : val)
    .optional()
    .refine((val) => !val || /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/.test(val), 'invalid product name'),

  price: z.string().optional().transform(str => {
    const num = parseInt(str || '', 10);
    return (Number.isInteger(num) && num > 0) ? str : undefined;
  })
});
export const ProductFinderTransformer = ProductFinder.transform(value => {
  let transformed: any = {};
  for (const [key, val] of Object.entries(value))
    if (!!val) transformed[key] = val
  return transformed;
})
export type ProductFinderType = z.infer<typeof ProductFinder>;

export default ProductSchema;
export const PartialProductSchema = z.strictObject({
  productImage: z
    .instanceof(FileList)
    .refine(files => files.length <= 1, "Single Product image is required")
    .refine(files => (files[0] === undefined) || (files[0]?.size <= 2 ** 20), `Max image size is 1MB.`) // 1MB limit
    .refine(
      files => ['image/jpeg', 'image/png', 'image/webp'].includes(files[0]?.type) || (files[0] === undefined),
      "Only .jpg, .png, .webp formats are supported."
    ).optional(),
  productName: z
    .string({ required_error: 'product name is required' })
    .regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid product name')
    .optional(),
  brandName: z
    .string({ required_error: 'brand name is required' })
    .regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid brand name')
    .optional(),
  price: z
    .coerce
    .number({ required_error: 'price is required' })
    .int().positive().optional(),
  productDescription: z
    .string({ required_error: "product description is required" })
    .min(10).max(200).optional()
});
export type PartialProductSchemaType = z.infer<typeof PartialProductSchema>;
export type ProductSchemaType = z.infer<typeof ProductSchema>;

export const ProductQuery = z.strictObject({
  q: z.string().optional()
})
export const ProductPaginatedSchema = paginatedDocx.extend({ docs: z.array(ProductResponseSchema.omit({ productDescription: true })) })
export type ProductQueryType = z.infer<typeof ProductQuery>;
export type ProductPaginatedType = z.infer<typeof ProductPaginatedSchema>

export const paginationDefault = {
  totalDocs: 0,
  offset: 0,
  limit: 0,
  totalPages: 0,
  page: 0,
  pagingCounter: 0,
  nextPage: null,
  prevPage: null,
  hasPrevPage: false,
  hasNextPage: false,
  docs: [],
}
