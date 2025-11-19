import { z } from 'zod/v3';
const lazyLoadingQueryValidator = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(0).optional()
}).refine((params)=>{
  if(params.page===undefined)
    params.page = 1;
  return params;
});
export { lazyLoadingQueryValidator };
export type lazyLoadingQueryType = z.infer<typeof lazyLoadingQueryValidator>;
