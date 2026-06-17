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
const productQuantity = z.int().nonnegative();
const price = z.int().positive();

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
const optionalProductImage = z.instanceof(FileList)
  .refine(files => files.length === 0 || files.length <= 1, "Only one image allowed")
  .refine(files => files.length === 0 || files[0]?.size <= 2 ** 20, "Max image size is 1MB")
  .refine(files => files.length === 0 || ['image/jpeg', 'image/png', 'image/webp'].includes(files[0]?.type), "Supported formats: .jpg, .png, .webp").optional()
export const PartialProductSchema = z.object({
  productImage: optionalProductImage,
  productName: productName,
  brandName: brandName,
  price: price,
  productQuantity: productQuantity,
});

export const ProductFinder = z.object({
  id: z.string().optional().refine(val => val === '' || val === undefined || /^[0-9a-fA-F]{1,24}$/.test(val), 'invalid id'),
  brandName: z.string().optional().refine(val => val === undefined || val.trim() === '' || /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/.test(val), 'invalid brand name'),
  productName: z.string().optional().refine(val => val === undefined || val.trim() === '' || /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/.test(val), 'invalid product name'),
  price: z.object({
    value: z.coerce.number().int().nonnegative(),
    operator: z.enum(['gt', 'lt', 'gte', 'lte', 'eq']),
  }).default({ operator: 'lte', value: 0 }).optional(),
});

export const ProductFinderTransformer = ProductFinder.transform(value => {
  if (value.id === undefined || value.id.trim() === '') delete value.id;
  if (value.brandName === undefined || value.brandName.trim() === '') delete value.brandName;
  if (value.productName === undefined || value.productName.trim() === '') delete value.productName;
  const { price, ...transformed } = value;
  return (price !== undefined && (price.value === 0 || price.value === undefined)) ? transformed : ({ ...transformed, price });
});

export const ProductPaginatedSchema = paginatedDocx.extend({ docs: z.array(ProductResponseSchema.omit({ productQuantity: true })) });

export const ProductQuery = z.strictObject({ q: z.string().optional() });

export type ProductQueryType = z.infer<typeof ProductQuery>;
export type ProductFinderType = z.infer<typeof ProductFinder>;
export type ProductSchemaType = z.infer<typeof ProductSchema>;
export type ProductPaginatedType = z.infer<typeof ProductPaginatedSchema>;
export type PartialProductSchemaType = z.infer<typeof PartialProductSchema>;

export default ProductSchema;
