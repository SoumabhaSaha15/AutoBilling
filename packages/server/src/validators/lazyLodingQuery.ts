import z from 'zod';
import page from "@/validators/pagination"
const lazyLoadingQueryValidator = z.object({
  q: z.string().optional(),
  page,
}).refine((params) => {
  if (params.page === undefined)
    params.page = 1;
  return params;
});
export { lazyLoadingQueryValidator };
export type lazyLoadingQueryType = z.infer<typeof lazyLoadingQueryValidator>;
