import { z } from "zod";
import { ProductResponseSchema } from "./product";
const OrderValidator = ProductResponseSchema
  .pick({ id: true })
  .extend({ quantity: z.coerce.number().int().positive() });
const OrdersValidator = z
  .array(OrderValidator)
  .transform((orders) => {
    const uniqueOrdersMap = new Map<string, number>();
    orders.forEach(order => uniqueOrdersMap.set(order.id, (uniqueOrdersMap.get(order.id) || 0) + order.quantity));
    orders = [];
    uniqueOrdersMap.forEach((quantity, id) => orders.push({ id, quantity }));
    return orders;
  })
  ;
export type OrderType = z.infer<typeof OrderValidator>;
export type OrdersType = z.infer<typeof OrdersValidator>;
const InvoiceValidator = z.strictObject({
  id: z.string({ required_error: "id is required." }).length(24).regex(/^[0-9a-fA-F]{24}$/),
  employeeEmail: z.string({ required_error: "employee email is required" })
    .email({ message: "invalid email" }),
  dateTime: z.string({ required_error: "date is required" })
    .datetime({ message: "invalid date time." }),
  customerEmail: z.string({ required_error: "customer email is required" })
    .email({ message: "invalid email" }),
  orders: OrdersValidator
    .transform(orders => orders.map((val) => ({ productId: val.id, quantity: val.quantity })))
});
export const InvoiceResponse = InvoiceValidator
  .omit({ orders: true })
  .extend({
    orders: z.array(z.strictObject({
      productId: ProductResponseSchema.pick({
        productName: true,
        brandName: true,
        price: true
      }),
    }).merge(OrderValidator.pick({ quantity: true })))
  })
export type InvoiceResponseType = z.infer<typeof InvoiceResponse>
export type InvoiceType = z.infer<typeof InvoiceValidator>;

export { OrderValidator, OrdersValidator, InvoiceValidator };
