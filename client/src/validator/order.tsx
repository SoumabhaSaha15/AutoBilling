import { z } from "zod";
import { ProductResponseSchema } from "./product";
const OrderValidator = ProductResponseSchema.pick({ id: true }).extend({ quantity: z.coerce.number().int().positive() });
const OrdersValidator = z.array(OrderValidator);
export type OrderType = z.infer<typeof OrderValidator>;
export type OrdersType = z.infer<typeof OrdersValidator>;
export { OrderValidator, OrdersValidator };
