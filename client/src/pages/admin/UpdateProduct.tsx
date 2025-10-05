import base from '../../utility/axios-base'
import { ZodError as v3Error } from "zod/v3";
import { useParams } from "react-router-dom";
import { AiFillProduct } from "react-icons/ai"
import { FC, useState, useEffect } from "react";
import { PiTrademarkFill } from "react-icons/pi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { ZodError as v4Error, prettifyError } from "zod/v4";
import { useToast } from "../../contexts/Toast/ToastContext";
import { HiCurrencyRupee, HiPencilAlt } from "react-icons/hi";
import { Button, Label, TextInput, FileInput, Spinner } from "flowbite-react";
import ProductSchema, { ProductSchemaType, ProductResponseSchema } from "../../validator/product";

const UpdateProduct: FC = () => {
  const defaultUrl = '/upload-image.svg';
  const [previewUrl, setPreviewUrl] = useState(defaultUrl);
  const param = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<ProductSchemaType>({ resolver: zodResolver(ProductSchema) });
  const watchedImage = watch("productImage");

  useEffect(() => {
    if (watchedImage && watchedImage[0]) {
      const objectUrl = URL.createObjectURL(watchedImage[0]);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else setPreviewUrl(defaultUrl);
  }, [watchedImage]);

  useEffect(() => {
    base.get('/products/' + param['id'] || '').then(({ data, status, statusText }) => {
      if (status !== 200) return void toast.open(statusText, 'alert-error', true);
      try {
        const product = ProductResponseSchema.parse(data);
        setPreviewUrl(product.productImage);
        setValue('brandName', product.brandName);
        setValue('productName', product.productName);
        setValue('price', product.price);
        setValue('productDescription', product.productDescription);
      } catch (err) {
        if (err instanceof v3Error || err instanceof v4Error) toast.open(prettifyError(err), 'alert-error');
        else console.error(err);
      }
    })
  }, [])
  const productSubmit: SubmitHandler<ProductSchemaType> = (_data) => {
    setIsLoading(true);
    // const _formData = new FormData();
    reset();
  }

  return (
    <div className="min-h-[calc(100dvh-64px)] grid items-center justify-center place-items-center">
      <form className="flex max-w-[95%] md:w-md sm:w-sm flex-col gap-4"
        name="adminLogin"
        onSubmit={handleSubmit(productSubmit)}
        encType="multipart/form-data"
      >
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Update id:{param['id'] || ''} </h3>

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

        <Button type="submit" disabled={isLoading} className="disabled:bg-blue-950">{
          (isLoading) ?
            (<><Spinner aria-label="submit" size="sm" className="mr-2" />{"updating product"}</>)
            : ("update product")
        }</Button>
      </form>
    </div>
  )
}
export default UpdateProduct;
