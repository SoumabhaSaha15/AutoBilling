import z from "zod";
import id from "./objectId";

const InvoiceBrief = z.strictObject({
  customerEmail: z.email(),
  employeeEmail: z.email(),
  dateTime: z.iso.datetime({ message: "invalid date time." }),
  ordersCount: z.number().int().nonnegative(),
  totalAmount: z.number().nonnegative(),
  _id: id
});
const InvoiceBriefList = z.array(InvoiceBrief);
export type InvoiceBriefType = z.infer<typeof InvoiceBrief>;
export type InvoiceBriefListType = z.infer<typeof InvoiceBriefList>;
export { InvoiceBrief, InvoiceBriefList };
