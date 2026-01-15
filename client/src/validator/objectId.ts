import z from "zod";
const id = z.string({ error: "id is required." }).length(24).regex(/^[0-9a-fA-F]{24}$/)
export default id;
