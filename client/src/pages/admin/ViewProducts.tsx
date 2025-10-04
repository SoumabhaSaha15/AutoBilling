import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod/v3";
import base from './../../utility/axios-base';
import { FaBarcode } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai"
import { PiTrademarkFill } from "react-icons/pi";
import { HiSearch, HiCurrencyRupee } from "react-icons/hi";
import ProductCard from "../../components/admin/ProductCard";
import { useToast } from "../../contexts/Toast/ToastContext";
import { FC, useEffect, useState, useCallback } from "react";
import { ProductResponseSchema, ProductFinder, ProductFinderType, ProductFinderTransformer } from "../../validator/product";
import { Button, Modal, ModalBody, ModalHeader, TextInput, Kbd, Label } from "flowbite-react";
import { SurroundedNotFound } from '../SurroundedNotFound';

const ProductArray = z.array(ProductResponseSchema);
const ViewProducts: FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<z.infer<typeof ProductArray>>([]);
  const [openModal, setOpenModal] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const setSkip = useState<number>(0)[1];
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFinderType>({ resolver: zodResolver(ProductFinder) });

  const applySearch: SubmitHandler<z.infer<typeof ProductFinder>> = (data) => {
    reset();
    const params = ProductFinderTransformer.parse(data);
    navigate('/admin/search-products?'+(new URLSearchParams(params)).toLocaleString());
  }

  const handleScroll = useCallback(_.throttle(() => {
    const docEl = document.documentElement;
    if (docEl.clientHeight + window.pageYOffset >= docEl.scrollHeight - 50 && hasMore) {
      setSkip(prevSkip => {
        const newSkip = (prevSkip === 0) ? 20 : prevSkip + 10;
        base.get(`/products?${(new URLSearchParams({ skip: `${newSkip}`, limit: '10' })).toString()}`).then(res => {
          if (res.status !== 200) throw new Error(res.statusText);
          const parsedData = ProductArray.parse(res.data);
          setProducts(prev => prev.concat(parsedData));
          setHasMore(parsedData.length > 0);
        }).catch((error: Error) => toast.open(error.message, 'alert-error', true, 5000));
        return newSkip;
      });
    }
  }, 1500), []);

  useEffect(() => {
    if (hasMore === false) return window.removeEventListener("scroll", handleScroll);
    base.get('/products').then((res) => {
      if (res.status !== 200) throw new Error(res.statusText);
      setProducts(ProductArray.parse(res.data));
    }).catch((error: Error) => toast.open(error.message, 'alert-error', true, 5000));
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setOpenModal((prev) => !prev);
      }
    })
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.onkeydown = () => { };
    }
  }, [hasMore]);

  return (
    <div className="relative">
      {(products.length)?<div
        className="min-h-[calc(100dvh-64px)] grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 items-center place-items-center p-2 justify-center"
      >
        {products.map(data => <ProductCard key={data.id} {...data} />)}
      </div>:<SurroundedNotFound link='/admin/add-product'/>}
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
