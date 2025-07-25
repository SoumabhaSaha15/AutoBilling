import { z } from "zod";
import mongoose from "mongoose";
import { ProductModel } from "./Product.js";
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
  customerEmail: z.string({ required_error: "customer email is required" })
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
  customerEmail: { type: String, required: true },
  dateTime: { type: String, required: true },
  orders: [{
    _id: false,
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product_model",
      required: true
    },
    quantity: { type: Number, required: true }
  }]
}, { timestamps: true });

InvoiceSchema.pre('save', async function (next) {
  const orders = this.orders;
  if (!orders || orders.length === 0) return next(new Error("At least one order is required"));
  for (const order of orders)
    if (!(await ProductModel.exists({ _id: order.productId })))
      return next(new Error(`Product with ID ${order.productId} does not exist`));
  next();
});

const InvoiceModel = mongoose.model<InvoiceType>('invoice_model', InvoiceSchema);

export { InvoiceType, InvoiceModel, InvoiceSchema, InvoiceValidator };
