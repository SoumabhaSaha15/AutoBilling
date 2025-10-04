import { z } from "zod/v3";
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

export const FinderFilter = ProductFinder.transform((value)=>{
  const key = ['brandName','productName'];
  let filter:any = {};
  if(value.id!= undefined) return {_id:value.id};
  key.forEach(key=>{
    if(Object.hasOwn(value,key)){
      //@ts-ignore
      filter[key] = {$regex:value[key] , $options:'i'};
    }
  });
  if(Object.hasOwn(value,'price') && value.price)
    filter['price'] = {$lte:parseInt(value.price,10)};
  return filter;
})
export type ProductFinderType = z.infer<typeof ProductFinder>;
