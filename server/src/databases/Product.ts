import z from "zod";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ProductValidator = z.strictObject({
  productImage: z.url({ message: "not an url" }).startsWith("https://res.cloudinary.com/", { message: "not a proper profilePicture url" }),
  productPublicId: z.string({ error: "cloudinary image Id Required" }),
  productName: z.string({ error: "product name is required" }).regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, "invalid user name"),
  brandName: z.string({ error: "brand name is required" }).regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, "invalid user name"),
  price: z.coerce.number({ error: "price is required" }).int().positive(),
  productDescription: z.string({ error: "product description is required" }).min(10).max(200),
});

export type ProductType = z.infer<typeof ProductValidator>;

interface ProductDocument extends ProductType, mongoose.Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema<ProductDocument>(
  {
    productName: {
      type: String,
      required: [true, "product name is required."],
      validate: {
        validator: (value: string) =>
          ProductValidator.pick({ productName: true }).safeParse({
            productName: value,
          }).success,
        message: (props: { value: string }) =>
          `${props.value} is not a valid product name.`,
      },
    },
    brandName: {
      type: String,
      required: [true, "brand name is required."],
      validate: {
        validator: (value: string) =>
          ProductValidator.pick({ brandName: true }).safeParse({
            brandName: value,
          }).success,
        message: (props: { value: string }) =>
          `${props.value} is not a valid brand name.`,
      },
    },
    price: {
      type: Number,
      required: [true, "price is required."],
      validate: {
        validator: (value: number) =>
          ProductValidator.pick({ price: true }).safeParse({ price: value })
            .success,
        message: (props: { value: string }) => `${props.value} is not valid.`,
      },
    },
    productDescription: {
      type: String,
      required: [true, "description is required."],
      validate: {
        validator: (value: string) =>
          ProductValidator.pick({ productDescription: true }).safeParse({
            productDescription: value,
          }).success,
        message: (props: { value: string }) =>
          `${props.value} is not a valid product description`,
      },
    },
    productImage: {
      type: String,
      required: [true, "productImage url is required."],
      validate: {
        validator: (value: string) =>
          ProductValidator.pick({ productImage: true }).safeParse({
            productImage: value,
          }).success,
        message: (props: { value: string }) =>
          `${props.value} is not a valid image url.`,
      },
    },
    productPublicId: {
      type: String,
      required: [true, "Cloudinary public key is required."],
      validate: {
        validator: (value: string) =>
          ProductValidator.pick({ productPublicId: true }).safeParse({
            productPublicId: value,
          }).success,
        message: (props: { value: string }) =>
          `${props.value} is not a valid public key.`,
      },
    },
  },
  { timestamps: true }
);

ProductSchema.index({ productDescription: "text" });

ProductSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model<
  ProductDocument,
  mongoose.PaginateModel<ProductDocument>
>("product_model", ProductSchema);

export { ProductModel, ProductSchema, ProductValidator };
