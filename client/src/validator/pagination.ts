import z from "zod/v3";
const positiveInt = z.number().int().min(0);
const paginatedDocx = z.strictObject({
  totalDocs: positiveInt,
  offset: positiveInt.optional(),
  limit: positiveInt,
  totalPages: positiveInt,
  page: positiveInt,
  pagingCounter: positiveInt,
  nextPage: positiveInt.nullable(),
  prevPage: positiveInt.nullable(),
  hasPrevPage: z.boolean(),
  hasNextPage: z.boolean()
})
export default paginatedDocx;
