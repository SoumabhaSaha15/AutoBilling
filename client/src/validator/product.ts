import { z } from "zod";
const ProductSchema = z.strictObject({
  productImage: z
    .instanceof(FileList,)
    .refine(files => files.length == 1, "Single Product image is required")
    .refine(files => files[0]?.size <= 2 ** 20, `Max image size is 1MB.`) // 5MB limit
    .refine(
      files => ['image/jpeg', 'image/png', 'image/webp'].includes(files[0]?.type),
      "Only .jpg, .png, .webp formats are supported."
    ),
  productName: z
    .string({ required_error: 'product name is required' })
    .regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid product name'),
  brandName: z
    .string({ required_error: 'brand name is required' })
    .regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid product name'),
  price: z
    .coerce
    .number({ required_error: 'price is required' })
    .int().positive(),
  productDescription: z
    .string({ required_error: "product description is required" })
    .min(10).max(200)
});

const ProductResponseSchema = ProductSchema.omit({ productImage: true }).extend({
  productImage: z.string().url(),
  id: z.string({ required_error: "id is required." }).length(24).regex(/^[0-9a-fA-F]{24}$/)
});

export default ProductSchema;
export { ProductResponseSchema }
export type ProductSchemaType = z.infer<typeof ProductSchema>;
