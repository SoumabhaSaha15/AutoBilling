import { z } from "zod";
import { Card } from "flowbite-react";
import base from './../../utility/axios-base';
import { FC, useEffect, useState } from "react";
import { useToast } from "../../contexts/Toast/ToastContext";
import { ProductResponseSchema } from "../../validator/product";
const ProductArray: z.ZodArray<typeof ProductResponseSchema> = z.array(ProductResponseSchema);

const ProductCard: FC<z.infer<typeof ProductResponseSchema>> = (props) => {
  return (
    <Card
      id={props.id}
      className="max-w-sm"
      children={
        <>
          <img src={props.productImage} alt={props.brandName+" "+props.productName} />
          <h6 className="text-md font-semibold tracking-tight text-gray-900 dark:text-white">
            {props.productDescription}
          </h6>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{props.price}</span>
            <a
              href="#"
              className="rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
            >
              {'update'}
            </a>
          </div>
        </>
      }
    />
  )
};

const ViewProducts: FC = () => {
  const toast = useToast();
  const [products, setProducts] = useState<z.infer<typeof ProductArray>>([])
  useEffect(() => {
    try {
      base
        .get('/products')
        .then(
          ({ data, status, statusText }) => {
            if (status !== 200) {
              toast.open(statusText, 'alert-error', true, 5000);
              return;
            }
            setProducts(ProductArray.parse(data));
          }
        )
        .catch(console.error)
    } catch (e) {
      console.error(e);
    }
  }, []);
  return (
    <div className="min-h-[calc(100dvh-64px)] grid grid-cols-4 md:grid-cols-2 items-center place-items-center justify-center">
      {products.map(data => <ProductCard key={data.id} {...data} />)}
    </div>
  );
}
export default ViewProducts;
