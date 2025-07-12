import { z } from 'zod';
const lazyLoadingQueryValidator = z.object({
  skip: z.string()
    .regex(/^\d+$/, 'Skip must be a non-negative integer')
    .transform(Number)
    .optional(),
  limit: z.string()
    .regex(/^\d+$/, 'Limit must be a positive integer')
    .transform(Number)
    .refine(val => val > 0, 'Limit must be greater than 0')
    .optional(),
}).refine(
  (data) => {
    const hasSkip = data.skip !== undefined;
    const hasLimit = data.limit !== undefined;
    return hasSkip === hasLimit;
  },
  {
    message: 'Both skip and limit parameters must be provided together, or neither should be provided',
    path: ['skip', 'limit']
  }
);
export { lazyLoadingQueryValidator };
export type lazyLoadingQueryType = z.infer<typeof lazyLoadingQueryValidator>;
