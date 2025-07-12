import mongoose from "mongoose";
import { z } from "zod";
const ProductValidator = z.strictObject({
  productImage: z
    .string({ required_error: "image is required" })
    .url({ message: "not an url" }).startsWith(
      "https://res.cloudinary.com/",
      { message: "not a propper profilePicture url" }
    ),
  productName: z
    .string({ required_error: 'product name is required' })
    .regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid user name'),
  brandName: z
    .string({ required_error: 'brand name is required' })
    .regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'invalid user name'),
  price: z
    .coerce
    .number({ required_error: 'price is required' })
    .int().positive(),
  productDescription: z
    .string({ required_error: "product description is required" })
    .min(10).max(200)
});
export type ProductType = z.infer<typeof ProductValidator>;
const ProductSchema = new mongoose.Schema<ProductType>({
  productName: {
    type: String,
    required: [true, 'product name is required.'],
    validator: {
      validate: (value: string) => ProductValidator.pick({ 'productName': true }).safeParse({ name: value }).success,
      message: (props: { value: string; }) => `${props.value} is not a valid admin name.`
    }
  },
  brandName: {
    type: String,
    required: [true, 'brand name is required.'],
    validator: {
      validate: (value: string) => ProductValidator.pick({ 'brandName': true }).safeParse({ brandName: value }).success,
      message: (props: { value: string; }) => `${props.value} is not a valid admin name.`
    }
  },
  price:{
    type: Number,
    required: [true, 'price is required.'],
    validator: {
      validate: (value: number) => ProductValidator.pick({ 'price': true }).safeParse({ brandName: value }).success,
      message: (props: { value: string; }) => `${props.value} is not a valid admin name.`
    }
  },
  productDescription:{
    type: String,
    required: [true, 'description is required.'],
    validator: {
      validate: (value: string) => ProductValidator.pick({ 'productDescription': true }).safeParse({ brandName: value }).success,
      message: (props: { value: string; }) => `${props.value} is not a valid admin name.`
    }
  },
  productImage:{
    type: String,
    required: [true, 'name is required.'],
    validator: {
      validate: (value: string) => ProductValidator.pick({ 'productImage': true }).safeParse({ brandName: value }).success,
      message: (props: { value: string; }) => `${props.value} is not a valid admin name.`
    }
  }
}, { timestamps: true });
const ProductModel = mongoose.model<ProductType>('product_model',ProductSchema);
export {ProductModel,ProductSchema,ProductValidator};
