import z from "zod";
import id from "./objectId";
import { ProductResponseSchema } from "./product";

const quantity = z.number().int().positive();

const OrderValidator = z.strictObject({ id, quantity });
const OrdersValidator = z.array(OrderValidator)
  .transform((orders) => {
    const uniqueOrdersMap = new Map<string, number>();
    orders.forEach(order => uniqueOrdersMap.set(order.id, (uniqueOrdersMap.get(order.id) || 0) + order.quantity));
    orders = [];
    uniqueOrdersMap.forEach((quantity, id) => orders.push({ id, quantity }));
    return orders;
  });
export type OrderType = z.infer<typeof OrderValidator>;
export type OrdersType = z.infer<typeof OrdersValidator>;
const InvoiceValidator = z.strictObject({
  id,
  employeeEmail: z.email({ message: "invalid email" }),
  dateTime: z.iso.datetime({ message: "invalid date time." }),
  customerEmail: z.email({ message: "invalid email" }),
  orders: OrdersValidator.transform(orders => orders.map((val) => ({ productId: val.id, quantity: val.quantity })))
});
export const InvoiceResponse = InvoiceValidator
  .omit({ orders: true })
  .extend({
    orders: z.array(z.strictObject({
      productId: ProductResponseSchema.pick({
        productName: true,
        brandName: true,
      }),
      price: z.int().positive().default(0),
      quantity,
    }))
  })
export type InvoiceResponseType = z.infer<typeof InvoiceResponse>
export type InvoiceType = z.infer<typeof InvoiceValidator>;

export { OrderValidator, OrdersValidator, InvoiceValidator };
