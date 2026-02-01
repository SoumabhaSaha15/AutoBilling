import z from "zod";
import page from "./pagination.js";
export const ProductFinder = z.strictObject({
  id: z.string().trim().regex(/^[0-9a-fA-F]{1,24}$/, 'invalid id').optional(),
  brandName: z.string().trim().regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid brand name').optional(),
  productName: z.string().trim().regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid product name').optional(),
  price: z.strictObject({
    value: z.coerce.number().int().positive().optional(),
    operator: z.enum(['gt', 'lt', 'gte', 'lte', 'eq']).default('lte'),
  }).transform(price => {
    if (price.value === undefined) return undefined;
    return price;
  }).optional(),
  page,
});
export const ProductQueryTransformer = ProductFinder.transform((value) => {
  const queryBuilder: any = { $match: {} };
  if (value.id) queryBuilder.$match['$expr'] = { $regexMatch: { input: { $toString: "$_id" }, regex: value.id, options: "i" } };
  if (value.brandName) queryBuilder.$match['brandName'] = { $regex: value.brandName, $options: "i" };
  if (value.productName) queryBuilder.$match['productName'] = { $regex: value.productName, $options: "i" };
  if (value.price) queryBuilder.$match['price'] = { [`$${value.price.operator}`]: value.price.value };
  return {
    queryBuilder,
    page: value.page,
  };
})
export type ProductFinderType = z.infer<typeof ProductFinder>;
