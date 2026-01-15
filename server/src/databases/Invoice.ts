import z from "zod";
import mongoose from "mongoose";
import { ProductModel } from "./Product.js";
const OrdersValidator = z.strictObject({
  productId: z.coerce.string({ error: "product id is missing!!!" })
    .refine((v) => mongoose.Types.ObjectId.isValid(v), { message: "invalid object id" }),
  quantity: z.coerce
    .number({ error: "quantity is required" })
    .int({ message: "not an integer" })
    .positive({ message: "must be positive" }),
  price: z.number().positive().default(0).optional()
});

const InvoiceValidator = z.strictObject({
  employeeEmail: z.email({ message: "invalid email" }),
  customerEmail: z.email({ message: "invalid email" }),
  dateTime: z.iso.datetime({ message: "invalid date time." }),
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
    quantity: { type: Number, required: true },
    price: { type: Number, default: 0 }
  }]
}, { timestamps: true });

InvoiceSchema.pre('save', async function () {
  const orders = this.orders;
  if (!orders || orders.length === 0) throw Error("At least one order is required");
  for (const order of orders) {
    const product = await ProductModel.findOne({ _id: order.productId }, { price: 1 }).lean();
    if (!product) throw Error(`Product with ID ${order.productId} does not exist`);
    order.price = product.price;
    if (typeof order.price !== 'number' || order.price <= 0) throw Error(`Invalid price (${order.price}) found in ProductModel for ID ${order.productId}`);
  }
});

const InvoiceModel = mongoose.model<InvoiceType>('invoice_model', InvoiceSchema);

export { InvoiceType, InvoiceModel, InvoiceSchema, InvoiceValidator };
