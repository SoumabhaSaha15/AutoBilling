import _ from 'lodash';
import { z } from "zod/v3";
import { FaBarcode } from "react-icons/fa";
import base from './../../utility/axios-base';
import { AiFillProduct } from "react-icons/ai"
import { FC, useEffect, useState } from "react";
import { PiTrademarkFill } from "react-icons/pi";
import { useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { HiSearch, HiCurrencyRupee } from "react-icons/hi";
import ProductCard from "../../components/admin/ProductCard";
import { useToast } from "../../contexts/Toast/ToastContext";
import { Button, Modal, ModalBody, ModalHeader, TextInput, Kbd, Label } from "flowbite-react";
import { ProductResponseSchema, ProductFinder, ProductFinderType, ProductFinderTransformer } from "../../validator/product";
import OutletLoading from "./../../OutletLoading";
import { SurroundedNotFound } from '../SurroundedNotFound';
const ProductArray = z.array(ProductResponseSchema);
const ViewProducts: FC = () => {
  const toast = useToast();
  const [isEmpty,setIsEmpty] = useState(false);
  const [isLoading,setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [products, setProducts] = useState<z.infer<typeof ProductArray>>([]);
  const [search, setSearch] = useSearchParams();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFinderType>({ resolver: zodResolver(ProductFinder) });

  const applySearch: SubmitHandler<z.infer<typeof ProductFinder>> = (data) => {
    setIsLoading(true);
    const params = ProductFinderTransformer.parse(data);
    setSearch((_) => ({ ...params }));
    base.get(`/products-search?${(new URLSearchParams(params)).toLocaleString()}`).then(res => {
      if (res.status !== 200) throw new Error(res.statusText);
      const data = ProductArray.parse(res.data);
      setIsLoading((_)=>{
        setIsEmpty(!data.length);
        setProducts(data);
        return false;
      });
    }).catch((error: Error) => toast.open(error.message, 'alert-error', true, 5000));
    reset();
    setOpenModal(false);
  }

  useEffect(() => {
    const params = ProductFinderTransformer.parse(Object.fromEntries(search));
    base.get(`/products-search?${(new URLSearchParams(params)).toLocaleString()}`).then(res => {
      if (res.status !== 200) throw new Error(res.statusText);
      const data = ProductArray.parse(res.data);
      if(data.length == 0) setIsEmpty(true);
      setIsLoading((_)=>{
        setProducts(data);
        return false;
      });
    }).catch((error: Error) => toast.open(error.message, 'alert-error', true, 5000));

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setOpenModal((prev) => !prev);
      }
    })
    return () => { window.onkeydown = () => { } };
  }, []);

  return isLoading?(<OutletLoading/>):(
    <div className="relative">
      {
      (isEmpty)?(<SurroundedNotFound link='/admin/view-products' />):(
      <div
        className="min-h-[calc(100dvh-64px)] grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 items-center place-items-center p-2 justify-center"
      >
        {products.map(data => <ProductCard key={data.id} {...data} />)}
      </div>)
      }
      <Button
        className="fixed !h-16 !w-16 bottom-6 right-6 z-50 rounded-2xl !p-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
        color="blue"
        size="lg"
        onClick={() => {
          setOpenModal(true);
        }}
        children={<HiSearch className="h-6 w-6" />}
      />
      <Modal show={openModal} onClose={() => setOpenModal(false)} popup>
        <ModalHeader children={<span className="font-normal text-gray-500">Search pannel <Kbd>ctrl + K</Kbd></span>} className="!p-4" />
        <ModalBody children={<form className="space-y-6" onSubmit={handleSubmit(applySearch)}>

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
              icon={AiFillProduct}
              {...register('productName')}
              shadow
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
              {...register('brandName')}
              shadow
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="product-id">
                Product id
                {errors.id && (<div className="text-red-500">{errors.id.message}</div>)}
              </Label>
            </div>
            <TextInput
              id="product-id"
              type="text"
              placeholder="product id"
              icon={FaBarcode}
              {...register('id')}
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
              {...register('price')}
              icon={HiCurrencyRupee}
              shadow
            />
          </div>

          <Button className="w-full" type='submit'><HiSearch className="mr-2" /> {'Apply search filters'} </Button>
        </form>} />
      </Modal>
    </div>
  );
}
export default ViewProducts;
