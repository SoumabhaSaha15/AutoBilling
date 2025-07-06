import { z } from "zod";
import flattener from "./zod-error-flattener.js"
/**
 * @name validatorFactory
 * @param {z.ZodObject<T extends z.ZodRawShape>} picked
 * @description picks the required field (only one at a time) from the validator and validates the input
 */
export const validatorFactory = <T extends z.ZodRawShape>(picked: z.ZodObject<T>) => {
  return (value: string) => {
    if (typeof value !== 'string') return "you need to provide a string";
    const { success, error } = picked.safeParse({ [Object.keys(picked.shape)[0] as string]: value });
    return (success) ? (true) : flattener(error);
  }
};