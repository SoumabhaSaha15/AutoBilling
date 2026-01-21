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
const productName = z.string({ error: 'product name is required' }).regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid product name').trim();
const brandName = z.string({ error: 'brand name is required' }).regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid brand name').trim();
const price = z.number({ error: 'price is required' }).int().positive();
const productQuantity = z.number({ error: "product quantity is required" }).int().nonnegative();


const ProductSchema = z.strictObject({
  productImage,
  productName,
  brandName,
  price,
  productQuantity,
});

export const ProductResponseSchema = ProductSchema
  .omit({ productImage: true })
  .extend({
    productImage: z.url({ error: "product image is required." }),
    id,
  });

export const PartialProductSchema = z.strictObject({
  productImage: productImage.optional(),
  productName: productName.optional(),
  brandName: brandName.optional(),
  price: price.optional(),
  productQuantity: productQuantity.optional()
});

export const ProductFinder = z.object({
  brandName: brandName.optional(),
  productName: productName.optional(),
  price: z.object({
    value: price.optional(),
    operator: z.enum(['gt', 'lt', 'gte', 'lte', 'eq']),
  }).default({ operator: 'lte' }).optional(),
});

export const ProductFinderTransformer = ProductFinder.transform(value => {
  if (value.brandName === undefined || value.brandName.trim() === '') delete value.brandName;
  if (value.productName === undefined || value.productName.trim() === '') delete value.productName;
  if (value.price?.value === undefined) delete value.price;
  return value;
})

export const ProductPaginatedSchema = paginatedDocx.extend({ docs: z.array(ProductResponseSchema.omit({ productQuantity: true })) });

export const ProductQuery = z.strictObject({ q: z.string().optional() });

export type ProductFinderType = z.infer<typeof ProductFinder>;
export type PartialProductSchemaType = z.infer<typeof PartialProductSchema>;
export type ProductSchemaType = z.infer<typeof ProductSchema>;
export type ProductQueryType = z.infer<typeof ProductQuery>;
export type ProductPaginatedType = z.infer<typeof ProductPaginatedSchema>;

export default ProductSchema;
