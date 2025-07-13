import { z } from "zod";
import base from './../../utility/axios-base';
import { FC, useEffect, useState,useCallback } from "react";
import { useToast } from "../../contexts/Toast/ToastContext";
import { ProductResponseSchema } from "../../validator/product";
import { Card, Accordion, AccordionContent, AccordionPanel, AccordionTitle } from "flowbite-react";

const ProductArray: z.ZodArray<typeof ProductResponseSchema> = z.array(ProductResponseSchema);

const ProductCard: FC<z.infer<typeof ProductResponseSchema>> = (props) => {
  return (
    <Card
      id={props.id}
      className="max-w-sm hover:scale-90 hover:shadow-2xl hover:dark:shadow-black hover:shadow-gray-600"
      children={
        <>
          <img
            src={props.productImage}
            className="rounded-2xl shadow-lg outline-1 outline-black dark:outline-white"
            alt={[props.brandName,props.productName].join(" ")}
            loading="lazy"
            onError={(e) => { e.currentTarget.src = "./image-broken.svg"; }}
          />
          <Accordion collapseAll>
            <AccordionPanel>
              <AccordionTitle>{props.brandName + " " + props.productName}</AccordionTitle>
              <AccordionContent>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  {props.productDescription}
                </p>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-medium text-gray-900 dark:text-white">
              {"₹"}{props.price}
            </span>
            <a
              href=""
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
  const [products, setProducts] = useState<z.infer<typeof ProductArray>>([]);
  const [lazyParams, setLazyParams] = useState<{ skip: number, limit: number }>({ skip: 0, limit: 20 });
  const [hasMore, setHasMore] = useState(true); // State to track if there are more products to load

  const handleScroll = useCallback(() => {
    const { clientHeight } = document.documentElement;
    const { pageYOffset } = window;
    const { scrollHeight } = document.documentElement;

    // Only fetch if we're at the bottom and there are potentially more items
    if (clientHeight + pageYOffset >= scrollHeight - 50 && hasMore) { // Added a small buffer (50px)
      // Use the functional update to get the latest state of lazyParams
      setLazyParams(prevLazyParams => {
        const newSkip = (prevLazyParams.limit === 20 && prevLazyParams.skip === 0) ? 20 : prevLazyParams.skip + 10;
        const newLimit = 10; // Subsequent calls will always fetch 10
        const params = new URLSearchParams();
        params.append('skip', newSkip.toString());
        params.append('limit', newLimit.toString());
        base.get('/products?' + params.toString())
          .then(({ data, status, statusText }) => {
            if (status !== 200) {
              toast.open(statusText, 'alert-error', true, 5000);
              return;
            }
            try {
              const parsedData = ProductArray.parse(data);
              if (parsedData.length) {
                setProducts(prev => prev.concat(parsedData));
              } else {
                setHasMore(false); // No more products to load
              }
            } catch (e) {
              toast.open('parsing error', 'alert-error', true, 5000);
            }
          })
          .catch(error => {
            console.error(error);
            toast.open('Error fetching products', 'alert-error', true, 5000);
          });
        return { skip: newSkip, limit: newLimit };
      });
    }
  }, [hasMore, toast]); // Add hasMore and toast to dependencies

  useEffect(() => {
    try {
      base.get('/products')
        .then(
          ({ data, status, statusText }) => {
            if (status !== 200) {
              toast.open(statusText, 'alert-error', true, 5000);
              return;
            }
            setProducts(ProductArray.parse(data));
          }
        ).catch(console.error);
    } catch (e) {
      console.error(e);
    }
    window.addEventListener("scroll", handleScroll);
    return () => { window.removeEventListener("scroll", handleScroll) };
  }, []);

  return (
    <div className="min-h-[calc(100dvh-64px)] grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 items-center place-items-center p-2 justify-center">
      {products.map(data => <ProductCard key={data.id} {...data} />)}
    </div>
  );
}
export default ViewProducts;
