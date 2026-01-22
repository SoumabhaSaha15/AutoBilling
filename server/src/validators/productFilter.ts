import z from "zod";
export const ProductFinder = z.strictObject({
  id: z.string().trim().regex(/^[0-9a-fA-F]{1,24}$/, 'invalid id').optional(),
  brandName: z.string().trim().regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid brand name').optional(),
  productName: z.string().trim().regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid product name').optional(),
  price: z.string().optional().transform(str => {
    const num = parseInt(str || '', 10);
    return (Number.isInteger(num) && num > 0) ? str : undefined;
  })
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
    filter['price'] = { $lte: parseInt(value.price, 10) };
  return filter;
})
export type ProductFinderType = z.infer<typeof ProductFinder>;
