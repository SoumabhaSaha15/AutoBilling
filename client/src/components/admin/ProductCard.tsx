import { z } from "zod";
import { FC } from "react";
import { ProductResponseSchema } from "../../validator/product";
import { Card, Accordion, AccordionContent, AccordionPanel, AccordionTitle } from "flowbite-react";

const ProductCard: FC<z.infer<typeof ProductResponseSchema>> = (props) => {
  return (
    <Card
      id={props.id}
      className="max-w-sm 2xl:max-w-full 2xl:w-full hover:scale-90 hover:shadow-2xl hover:dark:shadow-black hover:shadow-gray-600"
      children={
        <>
          <img
            src={props.productImage}
            className="rounded-md shadow-lg outline-1 outline-black dark:outline-white"
            alt={[props.brandName, props.productName].join(" ")}
            loading="lazy"
            onError={(e) => { e.currentTarget.src = "/image-broken.svg"; }}
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
export default ProductCard
