import z from "zod";
import page from "./pagination";
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

export const FinderFilter = ProductFinder.transform((value) => {
  const key = ['brandName', 'productName'];
  let filter: any = {};
  if (value.id != undefined) return { _id: value.id };
  key.forEach(key => {
    if (Object.hasOwn(value, key)) {
      //@ts-ignore
      filter[key] = { $regex: value[key], $options: 'i' };
    }
  });
  if (Object.hasOwn(value, 'price') && value.price)
    // filter['price'] = { $lte: parseInt(value.price?.value||"", 10) };
    return filter;
})
export type ProductFinderType = z.infer<typeof ProductFinder>;
