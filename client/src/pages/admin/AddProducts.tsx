import z from "zod";
import { FC } from "react";
import flatten from './../../utility/zod-error-flattener'
import base from './../../utility/axios-base'
import { AiFillProduct } from "react-icons/ai"
import { PiTrademarkFill } from "react-icons/pi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useToast } from "../../contexts/Toast/ToastContext";
import { HiCurrencyRupee, HiPencilAlt } from "react-icons/hi";
import { Button, Label, TextInput, FileInput } from "flowbite-react";
import ProductSchema, { ProductSchemaType } from "../../validator/product";

const productWithID = ProductSchema.omit({ productImage: true }).extend({
  productImage: z.string().url(),
  id: z.string({ required_error: "id is required." }).length(24).regex(/^[0-9a-fA-F]{24}$/)
});
const AddProduct: FC = () => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProductSchemaType>({ resolver: zodResolver(ProductSchema) });

  const productSubmit: SubmitHandler<ProductSchemaType> = (data) => {
    const formData = new FormData();
    Object.entries(data)
      .forEach(([key, value]) => formData.set(key,
        (value instanceof FileList) ?
          value[0] :
          value.toString()
      ));
    base
      .post('/products', formData)
      .then(({ data, status }) => {
        if (status !== 200) toast.open(status.toString(), 'alert-success', true, 5000);
        else {
          let safeParsed = productWithID.safeParse(data);
          (safeParsed.success)?
            toast.open('product added id:' + safeParsed.data.id, 'alert-success', true, 5000):
            toast.open(flatten(safeParsed.error), 'alert-error', true, 5000);
        }
      })
      .catch(console.error);

    reset();
  }

  return (
    <div className="min-h-[calc(100dvh-64px)] grid items-center justify-center">
      <form className="flex min-w-sm max-w-md md:w-md sm:w-sm flex-col gap-4"
        name="adminLogin"
        onSubmit={handleSubmit(productSubmit)}
        encType="multipart/form-data"
      >
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Add Product</h3>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="product-image">
              Product Image
              {errors.productImage && (<div className="text-red-500">{errors.productImage.message}</div>)}
            </Label>
          </div>
          <FileInput
            id="product-image"
            {...register("productImage")}
            required
            accept="image/png, image/jpeg, image/webp"
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="product-name">
              Product name
              {errors.productName && (<div className="text-red-500">{errors.productName.message}</div>)}
            </Label>
          </div>
          <TextInput
            id="product-name"
            type="text"
            placeholder="product name"
            {...register("productName")}
            icon={AiFillProduct}
            required shadow
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="brand-name">
              Brand name
              {errors.brandName && (<div className="text-red-500">{errors.brandName.message}</div>)}
            </Label>
          </div>
          <TextInput
            id="brand-name"
            type="text"
            placeholder="brand name"
            icon={PiTrademarkFill}
            {...register("brandName")}
            required
            shadow
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="product-description">
              Product Description
              {errors.productDescription && (<div className="text-red-500">{errors.productDescription.message}</div>)}
            </Label>
          </div>
          <TextInput
            id="product-description"
            type="text"
            placeholder="product description"
            icon={HiPencilAlt}
            {...register("productDescription")}
            required
            shadow
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="product-price">
              Enter Price
              {errors.price && (<div className="text-red-500">{errors.price.message}</div>)}
            </Label>
          </div>
          <TextInput
            id="product-price"
            placeholder="price"
            type="number"
            icon={HiCurrencyRupee}
            {...register("price")}
            required
            shadow
          />
        </div>

        <Button type="submit">add product</Button>
      </form>
    </div>
  )
}
export default AddProduct;
