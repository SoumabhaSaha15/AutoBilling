import { z } from "zod";
import mongoose from "mongoose";

const OrdersValidator = z.strictObject({
  productId: z.coerce.string({ required_error: "product id is missing!!!" })
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
    _id:false,
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product_model",
      required: true
    },
    quantity: { type: Number, required: true }
  }]
}, { timestamps: true });


const InvoiceModel = mongoose.model<InvoiceType>('invoice_model', InvoiceSchema);

export { InvoiceType, InvoiceModel, InvoiceSchema, InvoiceValidator };
