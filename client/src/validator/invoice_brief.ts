import { z } from "zod";

const InvoiceBrief = z.strictObject({
  customerEmail: z.string().email(),
  employeeEmail: z.string().email(),
  dateTime: z.string(),
  ordersCount: z.number().int().nonnegative(),
  totalAmount: z.number().nonnegative(),
  _id: z.string({ required_error: "id is required." }).length(24).regex(/^[0-9a-fA-F]{24}$/)
});
const InvoiceBriefList = z.array(InvoiceBrief);
export type InvoiceBriefType = z.infer<typeof InvoiceBrief>;
export type InvoiceBriefListType = z.infer<typeof InvoiceBriefList>;
export { InvoiceBrief, InvoiceBriefList };
