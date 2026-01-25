import { prettifyError } from "zod";
import base from '../../utility/axios-base'
import { AiFillProduct } from "react-icons/ai"
import { FC, useState, useEffect } from "react";
import { PiTrademarkFill } from "react-icons/pi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useToast } from "../../contexts/Toast/ToastContext";
import { HiCurrencyRupee, HiPencilAlt } from "react-icons/hi";
import { Button, Label, TextInput, FileInput, Spinner } from "flowbite-react";
import ProductSchema, { type ProductSchemaType, ProductResponseSchema } from "../../validator/product";

const AddProduct: FC = () => {
  const defaultUrl = '/upload-image.svg';
  const [previewUrl, setPreviewUrl] = useState(defaultUrl);
  const toast = useToast();
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<ProductSchemaType>({
    resolver: zodResolver(ProductSchema)
  });
  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedImage = watch("productImage");
  useEffect(() => {
    if (watchedImage && watchedImage[0]) {
      const objectUrl = URL.createObjectURL(watchedImage[0]);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else setPreviewUrl(defaultUrl);
  }, [watchedImage]);

  const productSubmit: SubmitHandler<ProductSchemaType> = async (postData) => {
    try {
      const { data, status, statusText } = await base.postForm('/products', postData);
      if (status !== 200 && status !== 201) {
        toast.open(statusText, 'alert-error', true, 5000);
        reset();
      }
      else {
        const safeParsed = ProductResponseSchema.safeParse(data);
        if (safeParsed.success) toast.open(`${statusText} ${safeParsed.data.id}`, 'alert-success', true, 5000);
        else toast.open(prettifyError(safeParsed.error), 'alert-error', true, 5000);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.open(e.message, 'alert-error', true, 5000);
    }

  }

  return (
    <div className="min-h-[calc(100dvh-64px)] grid items-center justify-center place-items-center">
      <form className="flex max-w-[95%] md:w-md sm:w-sm flex-col gap-4"
        name="adminLogin"
        onSubmit={handleSubmit(productSubmit)}
        encType="multipart/form-data"
      >
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Add Product</h3>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="product-image">
              {"Product Image (accepts .jpeg,.png,.webp max-size 1MB)"}
              {errors.productImage && (<div className="text-red-500">{errors.productImage.message}</div>)}
              <div className="flex flex-col items-center justify-center py-2">
                <img src={previewUrl} className="my-3 aspect-square w-1/2 rounded-xl bg-gray-50 dark:bg-gray-700" alt="image uploaded" />
              </div>
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
            <Label htmlFor="product-quantity">
              Product Quantity
              {errors.productQuantity && (<div className="text-red-500">{errors.productQuantity.message}</div>)}
            </Label>
          </div>
          <TextInput
            id="product-quantity"
            type="number"
            placeholder="product quantity"
            icon={HiPencilAlt}
            {...register("productQuantity", { valueAsNumber: true })}
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
            {...register("price", { valueAsNumber: true })}
            required
            shadow
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="disabled:bg-blue-950">{
          (isSubmitting) ?
            (<><Spinner aria-label="submit" size="sm" className="mr-2" />{"adding product"}</>)
            : ("add product")
        }</Button>
      </form>
    </div>
  )
}
export default AddProduct;
