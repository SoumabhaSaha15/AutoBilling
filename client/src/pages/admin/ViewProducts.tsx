import { z } from "zod";
import base from './../../utility/axios-base';
import { FC, useEffect, useState, useCallback } from "react";
import { useToast } from "../../contexts/Toast/ToastContext";
import { ProductResponseSchema } from "../../validator/product";
import ProductCard from "../../components/admin/ProductCard";
const ProductArray = z.array(ProductResponseSchema);

const ViewProducts: FC = () => {
  const toast = useToast();
  const [products, setProducts] = useState<z.infer<typeof ProductArray>>([]);
  const [lazyParams, setLazyParams] = useState<{ skip: number, limit: number }>({ skip: 0, limit: 20 });
  const [hasMore, setHasMore] = useState(true); // State to track if there are more products to load

  const handleScroll = useCallback(() => {
    const { clientHeight } = document.documentElement, { pageYOffset } = window, { scrollHeight } = document.documentElement;
    if (clientHeight + pageYOffset >= scrollHeight - 50 && hasMore) {// Added a small buffer (50px) Only fetch if we're at the bottom and there are potentially more items
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
              (parsedData.length) ?
                setProducts(prev => prev.concat(parsedData)) :
                setHasMore(false); // No more products to load
            } catch (e) {
              toast.open('parsing error', 'alert-error', true, 5000);
            }
          })
          .catch(error => { toast.open((error as Error).message, 'alert-error', true, 5000); });
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
    <div className="min-h-[calc(100dvh-64px)] grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 items-center place-items-center p-2 justify-center">
      {products.map(data => <ProductCard key={data.id} {...data} />)}
    </div>
  );
}
export default ViewProducts;
