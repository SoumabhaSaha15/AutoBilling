import z from "zod";
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
});

export const paginationDefault = {
  totalDocs: 0,
  offset: 0,
  limit: 0,
  totalPages: 0,
  page: 0,
  pagingCounter: 0,
  nextPage: null,
  prevPage: null,
  hasPrevPage: false,
  hasNextPage: false,
  docs: [],
}
export default paginatedDocx;
