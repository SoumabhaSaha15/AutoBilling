import { z } from "zod";
import mongoose from "mongoose";

const OrdersValidator = z.strictObject({
  productId: z.string({ required_error: "product id is missing!!!" })
    .refine((v) => mongoose.Types.ObjectId.isValid(v), { message: "invalid object id" }),
  quantity: z.coerce
    .number({ required_error: "quantity is required" })
    .int({ message: "not an integer" })
    .positive({ message: "must be positive" })
});

const InvoiceValidator = z.strictObject({
  employeeEmail: z.string({ required_error: "employee email is required" })
    .email({ message: "invalid email" }),
  dateTime: z.string({ required_error: "date is required" })
    .datetime({ message: "invalid date time." }),
  orders: z.array(OrdersValidator).min(1, { message: "at least one order is required" }).transform((orders) => {
    const uniqueOrdersMap = new Map<string, number>();
    orders.forEach(order => uniqueOrdersMap.set(order.productId, (uniqueOrdersMap.get(order.productId) || 0) + order.quantity));
    orders = [];
    uniqueOrdersMap.forEach((quantity, productId) => orders.push({ productId, quantity }));
    return orders;
  }),
});

type InvoiceType = z.infer<typeof InvoiceValidator>;

const InvoiceSchema = new mongoose.Schema<InvoiceType>({
  employeeEmail: { type: String, required: true },
  dateTime: { type: String, required: true },
  orders: [{
    productId: { type: String, required: true },
    quantity: { type: Number, required: true }
  }]
}, { timestamps: true });

InvoiceSchema.pre('save', function (next) {
  const result = InvoiceValidator.safeParse(this.toObject());
  (!result.success) ? next(result.error) : next();
});

const InvoiceModel = mongoose.model<InvoiceType>('invoice_model', InvoiceSchema);

export { InvoiceType, InvoiceModel, InvoiceSchema, InvoiceValidator };
