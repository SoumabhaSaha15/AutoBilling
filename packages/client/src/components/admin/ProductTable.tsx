import z from "zod";
import { FC } from "react";
import { Link } from "react-router-dom";
import { ProductResponseSchema } from "@/validator/product";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Avatar } from "flowbite-react";

type propType = z.infer<typeof ProductResponseSchema>;

export const ProductTable: FC<{ table: Omit<propType, "productQuantity">[] }> = ({ table }) => {
  return (
    <div className="overflow-x-auto p-2 max-h-[calc(100dvh-120px)] w-full flex flex-col sm:items-center">
      <Table hoverable className="max-w-4xl">
        <TableHead>
          <TableRow>
            <TableHeadCell>Image</TableHeadCell>
            <TableHeadCell>Brand name</TableHeadCell>
            <TableHeadCell>Product name</TableHeadCell>
            <TableHeadCell>Price</TableHeadCell>
            <TableHeadCell>Edit</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {table.map((it) => (
            <TableRow key={crypto.randomUUID()} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell className="aspect-square">
                <Avatar img={it.productImage} size="lg" />
              </TableCell>
              <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {it.brandName}
              </TableCell>
              <TableCell>
                {it.productName}
              </TableCell>
              <TableCell >
                {"₹" + it.price}
              </TableCell>
              <TableCell>
                <Link
                  to={"/admin/update-product/" + it.id}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Edit
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
