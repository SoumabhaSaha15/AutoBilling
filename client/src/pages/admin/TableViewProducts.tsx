
import _ from 'lodash';
import { z } from "zod/v3";
import Loading from '../../Loading';
import { HiSearch,HiFilter } from "react-icons/hi";
import base from '../../utility/axios-base';
import { useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SurroundedNotFound } from '../SurroundedNotFound';
import { ProductTable } from '../../components/admin/ProductTable';
import { useToast } from "../../contexts/Toast/ToastContext";
import { FC, useEffect, useState, useCallback } from "react";
import { ProductResponseSchema, ProductQueryType, ProductQuery } from "../../validator/product";
import { Button, Modal, ModalBody, ModalHeader, TextInput, Kbd, Label,Pagination } from "flowbite-react";

const ProductArray = z.array(ProductResponseSchema.omit({productDescription:true}));
const ViewProducts: FC = () => {
  const toast = useToast();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [products, setProducts] = useState<z.infer<typeof ProductArray>>([]);
  const [openModal, setOpenModal] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const setSkip = useState<number>(0)[1];
  const [query, setQuery] = useSearchParams();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductQueryType>({ resolver: zodResolver(ProductQuery) });

  const applySearch: SubmitHandler<z.infer<typeof ProductQuery>> = (data) => {
    reset();
    setQuery(_ => data);
    setOpenModal(false);
  }

  const handleScroll = useCallback(_.throttle(() => {
    const docEl = document.documentElement;
    if (docEl.clientHeight + window.pageYOffset >= docEl.scrollHeight - 50 && hasMore) {
      setSkip(prevSkip => {
        const newSkip = (prevSkip === 0) ? 20 : prevSkip + 10;
        const param = new URLSearchParams({ skip: `${newSkip}`, limit: '10' });
        if (query.get('q')) param.append('q', query.get('q') || '');
        base.get(`/products?${param.toString()}`).then(res => {
          if (res.status !== 200) throw new Error(res.statusText);
          const parsedData = ProductArray.parse(res.data);
          setProducts(prev => prev.concat(parsedData));
          setHasMore(parsedData.length > 0);
        }).catch((error: Error) => toast.open(error.message, 'alert-error', true, 5000));
        return newSkip;
      });
    }
  }, 1500), [query]);

  useEffect(() => {
    if (hasMore === false) return window.removeEventListener("scroll", handleScroll);
    base.get('/products' + (query.get('q') ? `?q=${query.get('q')}` : '')).then((res) => {
      if (res.status !== 200) throw new Error(res.statusText);
      setProducts((_) => {
        setTimeout(() => setIsLoaded(true), 1000);
        return ProductArray.parse(res.data)
      });
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
  }, [hasMore, query]);

  return (
    <div className='flex flex-col justify-center items-center'>
      {(products.length && isLoaded) ?
        (
          <>
            <div className="w-full py-4 px-2 flex items-center justify-center">
              <TextInput type='search' placeholder='search' className='pr-2' icon={HiSearch} /> <Button className='p-0 h-10 w-10' children={<HiFilter className='w-6 h-6' />}/>
            </div>
            <ProductTable table={products} />
            <div className="flex overflow-x-auto justify-center">
              <Pagination currentPage={1} totalPages={100} onPageChange={()=>{}} />
            </div>
          </>

        ) : (isLoaded) ?
          <SurroundedNotFound link='/admin/add-product' /> :
          <Loading />
      }
      {/* <Button
        className="fixed !h-16 !w-16 bottom-6 right-6 z-50 rounded-2xl !p-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
        color="blue"
        size="lg"
        onClick={() => {
          setOpenModal(true);
        }}
        children={<HiSearch className="h-6 w-6" />}
      /> */}
      {/* <Modal show={openModal} onClose={() => setOpenModal(false)} popup>
        <ModalHeader children={<span className="font-normal text-gray-500">Search pannel <Kbd>ctrl + K</Kbd></span>} className="!p-4" />
        <ModalBody children={<form className="space-y-6" onSubmit={handleSubmit(applySearch)}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="query">
                Query
                {errors.q && (<div className="text-red-500">{errors.q.message}</div>)}
              </Label>
            </div>
            <TextInput
              id="query"
              type="text"
              placeholder="product name"
              icon={HiSearch}
              {...register('q')}
              shadow
            />
          </div>

          <Button className="w-full" type='submit'><HiSearch className="mr-2" /> {'Apply search filters'} </Button>
        </form>} />
      </Modal> */}
    </div>
  );
}
export default ViewProducts;
