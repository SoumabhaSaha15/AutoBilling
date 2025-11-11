import { z } from "zod/v3";
import { FC } from "react";
import { ProductResponseSchema } from "../../validator/product";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow,Avatar } from "flowbite-react";
type propType = z.infer<typeof ProductResponseSchema>
export const ProductTable:FC<{table:Omit<propType,"productDescription">[]}>=({table})=> {
  return (
    <div className="overflow-x-auto p-2 max-h-[calc(100dvh-192px)] w-full flex flex-col  items-center">
      <Table hoverable className="max-w-4xl">
        <TableHead>
          <TableRow>
            <TableHeadCell>Image</TableHeadCell>
            <TableHeadCell>Product name</TableHeadCell>
            <TableHeadCell>Brand name</TableHeadCell>
            <TableHeadCell>Price</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Edit</span>
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {table.map((it,index)=>(
          <TableRow key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell>{<Avatar img={it.productImage} size="lg" className="h-16" />}</TableCell>
            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {it.brandName}
            </TableCell>
            <TableCell>{it.productName}</TableCell>
            <TableCell>{"₹"}{it.price}</TableCell>
            <TableCell>
              <a href={"/admin/update-product/" + it.id} className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                Edit
              </a>
            </TableCell>
          </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
