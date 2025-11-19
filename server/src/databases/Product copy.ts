import mongoose from "mongoose";
import { z } from "zod/v3";
import mpv2 from "mongoose-paginate-v2";
const ProductValidator = z.strictObject({
  productImage: z
    .string({ required_error: "image is required" })
    .url({ message: "not an url" }).startsWith(
      "https://res.cloudinary.com/",
      { message: "not a propper profilePicture url" }
    ),
  productPublicId:z.string({required_error:"cloudinary image Id Required"}),
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
      message: (props: { value: string; }) => `${props.value} is not a valid product name.`
    }
  },
  brandName: {
    type: String,
    required: [true, 'brand name is required.'],
    validator: {
      validate: (value: string) => ProductValidator.pick({ 'brandName': true }).safeParse({ brandName: value }).success,
      message: (props: { value: string; }) => `${props.value} is not a valid brand name.`
    }
  },
  price:{
    type: Number,
    required: [true, 'price is required.'],
    validator: {
      validate: (value: number) => ProductValidator.pick({ 'price': true }).safeParse({ brandName: value }).success,
      message: (props: { value: string; }) => `${props.value} is not valid.`
    }
  },
  productDescription:{
    type: String,
    required: [true, 'description is required.'],
    validator: {
      validate: (value: string) => ProductValidator.pick({ 'productDescription': true }).safeParse({ brandName: value }).success,
      message: (props: { value: string; }) => `${props.value} is not a valid product description`
    }
  },
  productImage:{
    type: String,
    required: [true, 'productImage url is required.'],
    validator: {
      validate: (value: string) => ProductValidator.pick({ 'productImage': true }).safeParse({ brandName: value }).success,
      message: (props: { value: string; }) => `${props.value} is not a valid image url.`
    }
  },
  productPublicId:{
    type: String,
    required: [true, 'Cloudinary public key is required.'],
    validator: {
      validate: (value: string) => ProductValidator.pick({ 'productPublicId': true }).safeParse({ brandName: value }).success,
      message: (props: { value: string; }) => `${props.value} is not a valid public key.`
    }
  }
}, { timestamps: true });
ProductSchema.index({productDescription:'text'});
const ProductModel = mongoose.model<ProductType>('product_model',ProductSchema);
export {ProductModel,ProductSchema,ProductValidator};
