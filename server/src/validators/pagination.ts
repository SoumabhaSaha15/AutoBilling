import z from "zod";
const page = z.coerce.number().int().nonnegative().default(1);
export default page;
