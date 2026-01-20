import _ from 'lodash';
import Loading from '../../Loading';
import base from '../../utility/axios-base';
import { FC, useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import { HiSearch, HiFilter } from "react-icons/hi";
import { SurroundedNotFound } from '../SurroundedNotFound';
import { useToast } from "../../contexts/Toast/ToastContext";
import { paginationDefault } from '../../validator/pagination';
import { Button, TextInput, Pagination } from "flowbite-react";
import { ProductTable } from '../../components/admin/ProductTable';
import { ProductPaginatedSchema, type ProductPaginatedType } from "../../validator/product";

const ViewProducts: FC = () => {
  const toast = useToast();
  const [search, setSearch] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const [products, setProducts] = useState<ProductPaginatedType>(paginationDefault);
  const [query, setQuery] = useSearchParams();

  useEffect(() => {
    base
      .get('/products', { params: Object.fromEntries(query) })
      .then((res) => {
        if (res.status !== 200) throw new Error(res.statusText);
        setProducts((_) => {
          setTimeout(() => setIsLoaded(true), 1000);
          return ProductPaginatedSchema.parse(res.data);
        });
      })
      .catch((error: Error) => toast.open(error.message, 'alert-error', true, 5000));
  }, [query]);

  return (
    <div className='flex flex-col justify-center items-center'>
      {(products?.docs.length && isLoaded) ?
        (
          <>
            <div className="w-full py-4 px-2 flex items-center justify-center">
              <TextInput
                type='search'
                placeholder='Search product'
                className='pr-2'
                icon={HiSearch}
                enterKeyHint='search'
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    if (e.currentTarget.value === '') return void setQuery({});
                    setQuery({ q: e.currentTarget.value })
                  };
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

      {/* <Modal show={openModal} onClose={() => setOpenModal(false)} popup>
        <ModalHeader children={<span className="font-normal text-gray-500">Search pannel <Kbd>ctrl + K</Kbd></span>} className="!p-4" />
        <ModalBody children={
          <form className="space-y-6" onSubmit={handleSubmit(applySearch)}>
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
            <Button className="w-full" type='submit' ><HiSearch className="mr-2" /> {'Apply search filters'}
            </Button>
          </form>} />
      </Modal> */}
    </div>
  );
}
export default ViewProducts;
