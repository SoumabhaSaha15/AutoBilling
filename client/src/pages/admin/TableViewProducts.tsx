import z from "zod";
import qs from 'qs';
import Loading from '../../Loading';
import base from '../../utility/axios-base';
import { FC, useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import { HiSearch, HiFilter } from "react-icons/hi";
import { zodResolver } from '@hookform/resolvers/zod';
import { SurroundedNotFound } from '../SurroundedNotFound';
import { useToast } from "../../contexts/Toast/ToastContext";
import { useForm, type SubmitHandler } from 'react-hook-form';
import { paginationDefault } from '../../validator/pagination';
import { ProductTable } from '../../components/admin/ProductTable';
import { Button, TextInput, Pagination, Modal, ModalBody, ModalHeader, Kbd, Label, Select } from "flowbite-react";
import { ProductPaginatedSchema, type ProductPaginatedType, type ProductFinderType, ProductFinder, ProductFinderTransformer } from "../../validator/product";

const ViewProducts: FC = () => {

  const toast = useToast();
  const [query, setQuery] = useSearchParams();
  const [search, setSearch] = useState<string>('');
  const [openModal, setOpenModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductPaginatedType>(paginationDefault);
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFinderType>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    resolver: zodResolver(ProductFinder)
  });
  const Operators = ProductFinder.shape.price.unwrap().def.innerType.shape.operator.options;

  const applySearch: SubmitHandler<ProductFinderType> = (data) => {
    const transformed = ProductFinderTransformer.parse(data);
    console.log(transformed);
    setQuery(qs.stringify(transformed));
    setOpenModal(false);
  }

  useEffect(() => {
    const parsedParams = qs.parse(query.toString(), { allowDots: true });
    base
      .get('/products', { params: parsedParams })
      .then((res) => {
        if (res.status !== 200) throw new Error(res.statusText);
        setProducts(() => {
          setTimeout(() => setIsLoaded(true), 1000);
          return ProductPaginatedSchema.parse(res.data);
        });
      })
      .catch((error: Error) => toast.open(error.message, 'alert-error', true, 5000));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className='flex flex-col justify-center items-center'>
      {(products?.docs.length && isLoaded) ?
        (
          <>
            <div className="w-full py-4 px-2 flex items-center justify-center">
              <TextInput
                type='search'
                placeholder='Search product [id]'
                className='pr-2'
                icon={HiSearch}
                enterKeyHint='search'
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  try {
                    if (e.key == "Enter") {
                      if (e.currentTarget.value === '') return;
                      z.string().max(24).regex(/^[0-9a-fA-F]/).parse(e.currentTarget.value);
                      setQuery({ id: e.currentTarget.value });
                    }
                  } catch (error) {
                    toast.open(((error instanceof Error) ? (error.message) : ('Invalid product id')), 'alert-error');
                  }
                }}
              />
              <Button
                className='p-0 h-10 w-10'
                children={<HiFilter className='w-6 h-6' />}
                onClick={() => setOpenModal(true)}
              />
            </div>
            <ProductTable table={products.docs} />
            <div className="flex overflow-x-auto justify-center">
              <Pagination currentPage={products.page} totalPages={products.totalPages} onPageChange={(pageNumber) => { setQuery(prev => ({ ...prev, page: pageNumber })) }} />
            </div>
          </>

        ) : (isLoaded) ?
          <SurroundedNotFound link='/admin/add-product' /> :
          <Loading />
      }

      <Modal dismissible={true} show={openModal} onClose={() => setOpenModal(false)} popup>
        <ModalHeader children={<span className="font-normal text-base"> Product Filter <Kbd>ctrl + K</Kbd></span>} className="p-4!" />
        <ModalBody children={
          <form className="space-y-6" onSubmit={handleSubmit(applySearch)} >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="brand-name">
                  Brand Name
                  {errors.brandName && (<div className="text-red-500">{errors.brandName.message}</div>)}
                </Label>
              </div>
              <TextInput
                id="brand-name"
                type="text"
                placeholder="brand name"
                {...register('brandName')}
                shadow
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="product-name">
                  Product Name
                  {errors.productName && (<div className="text-red-500">{errors.productName.message}</div>)}
                </Label>
              </div>
              <TextInput
                id="product-name"
                type="text"
                placeholder="product name"
                {...register('productName')}
                shadow
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="price-value">
                  price range
                  {errors.price?.value && (<div className="text-red-500">{errors.price?.value.message}</div>)}
                </Label>
              </div>
              <TextInput
                id="price-value"
                type="number"
                placeholder="price range"
                {...register('price.value')}
                shadow
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="price-operator">
                  price operator
                  {errors.price?.operator && (<div className="text-red-500">{errors.price?.operator.message}</div>)}
                </Label>
              </div>
              <Select id="price-operator" {...register('price.operator')} shadow>
                {Operators.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
            </div>
            <Button className="w-full" type='submit' ><HiSearch className="mr-2" /> {'Apply search filters'}
            </Button>
          </form>} />
      </Modal>
    </div>
  );
}
export default ViewProducts;
