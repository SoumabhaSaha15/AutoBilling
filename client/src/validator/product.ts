import z from "zod";
import id from "./objectId";
import paginatedDocx from "./pagination";

const productImage = z.instanceof(FileList)
  .refine(files => files.length == 1, "Single Product image is required")
  .refine(files => files[0]?.size <= 2 ** 20, `Max image size is 1MB.`) // 1MB limit
  .refine(
    files => ['image/jpeg', 'image/png', 'image/webp'].includes(files[0]?.type),
    "Only .jpg, .png, .webp formats are supported."
  );
const productName = z.string({ error: 'product name is required' }).regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid product name');
const brandName = z.string({ error: 'brand name is required' }).regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid brand name');
const price = z.number({ error: 'price is required' }).int().positive();
// const productDescription = z.string({ error: "product description is required" }).min(10).max(200);
const productQuantity = z.number({ error: "product quantity is required" }).int().nonnegative();
const ProductSchema = z.strictObject({
  productImage,
  productName,
  brandName,
  price,
  productQuantity,
});

export const ProductResponseSchema = ProductSchema.omit({ productImage: true }).extend({
  productImage: z.url({ error: "product image is required." }),
  id,
});


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


export const PartialProductSchema = z.strictObject({
  productImage: productImage.optional(),
  productName: productName.optional(),
  brandName: brandName.optional(),
  price: price.optional(),
  productQuantity: productQuantity.optional()
});

export const ProductPaginatedSchema = paginatedDocx.extend({ docs: z.array(ProductResponseSchema.omit({ productQuantity: true })) });
export const ProductQuery = z.strictObject({ q: z.string().optional() });

export type ProductFinderType = z.infer<typeof ProductFinder>;
export type PartialProductSchemaType = z.infer<typeof PartialProductSchema>;
export type ProductSchemaType = z.infer<typeof ProductSchema>;
export type ProductQueryType = z.infer<typeof ProductQuery>;
export type ProductPaginatedType = z.infer<typeof ProductPaginatedSchema>;

export default ProductSchema;
