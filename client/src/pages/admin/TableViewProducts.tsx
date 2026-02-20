import z from "zod";
import qs from 'qs';
import Loading from '../../Loading';
import { HiFilter } from "react-icons/hi";
import base from '../../utility/axios-base';
import { useHotkeys } from "react-hotkeys-hook";
import { FC, useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
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
  const [openModal, setOpenModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductPaginatedType>(paginationDefault);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFinderType>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    resolver: zodResolver(ProductFinder),
  });
  const Operators = ProductFinder.shape.price.unwrap().def.innerType.shape.operator.options;

  const applySearch: SubmitHandler<ProductFinderType> = (data) => {
    const parsedData = ProductFinderTransformer.parse(data);
    setQuery(qs.stringify(parsedData));
    setOpenModal(false);
  }

  useEffect(() => {
    const parsedParams = qs.parse(query.toString(), { allowDots: true });
    const finderFormData = ProductFinderTransformer.parse(parsedParams);
    reset(finderFormData);
    base
      .get('/products', { params: parsedParams })
      .then((res) => {
        if (res.status !== 200) throw new Error(res.statusText);
        setProducts(() => {
          try {
            const parsed = ProductPaginatedSchema.parse(res.data);
            setTimeout(() => setIsLoaded(true), 1000);
            return parsed;
          } catch (error) {
            setTimeout(() => setIsLoaded(true), 1000);
            if (error instanceof z.ZodError) toast.open(z.prettifyError(error), 'alert-error', true, 5000);
            else toast.open((error as Error).message, 'alert-error');
            return paginationDefault;
          }
        });
      })
      .catch((error: Error) => {
        setTimeout(() => setIsLoaded(true), 1000);
        if (error instanceof z.ZodError) toast.open(z.prettifyError(error), 'alert-error', true, 5000);
        else toast.open(error.message, 'alert-error');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useHotkeys('mod+k', () => setOpenModal(true), { preventDefault: true });
  return (
    <div className='flex flex-col justify-center items-center'>
      {(products.docs.length && isLoaded) ?
        (
          <>
            <ProductTable table={products.docs} />
            <div className="flex overflow-x-auto justify-center">
              <Pagination
                currentPage={products.page}
                totalPages={products.totalPages}
                onPageChange={(pageNumber) => setQuery(prev => qs.stringify({ ...qs.parse(prev.toString()), page: pageNumber }))}
              />
            </div>
          </>

        ) : (isLoaded) ?
          <SurroundedNotFound link='/admin/add-product' /> :
          <Loading />
      }

      <Button
        className="fixed h-16! w-16! bottom-6 right-6 z-50 rounded-2xl p-4! shadow-lg hover:shadow-xl transition-shadow duration-300"
        color="blue"
        size="lg"
        onClick={() => setOpenModal(true)}
      >
        <HiFilter className="h-6 w-6" />
      </Button>
      <Modal dismissible={true} show={openModal} onClose={() => setOpenModal(false)} popup>
        <ModalHeader className="p-4!">
          <span className="font-normal text-base"> Product Filter <Kbd>ctrl + K</Kbd></span>
        </ModalHeader>
        <ModalBody>
          <form className="space-y-6" onSubmit={handleSubmit(applySearch)} >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="id">
                  id
                  {errors.id && (<div className="text-red-500">{errors.id.message}</div>)}
                </Label>
              </div>
              <TextInput
                id="id"
                type="text"
                placeholder="id"
                {...register('id')}
                shadow
              />
            </div>

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
                defaultValue={0}
                {...register('price.value', { valueAsNumber: true })}
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
            <Button className="w-full" type='submit' ><HiFilter className="mr-2" /> {'Apply search filters'}
            </Button>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}
export default ViewProducts;
