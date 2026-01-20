import z from "zod";
import { FC } from "react";
import { Link } from "react-router-dom";
import { ProductResponseSchema } from "../../validator/product";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Avatar } from "flowbite-react";

type propType = z.infer<typeof ProductResponseSchema>;

export const ProductTable: FC<{ table: Omit<propType, "productQuantity">[] }> = ({ table }) => {
  return (
    <div className="overflow-x-auto p-2 max-h-[calc(100dvh-192px)] w-full flex flex-col sm:items-center">
      <Table hoverable className="max-w-4xl">
        <TableHead>
          <TableRow>
            <TableHeadCell>Image</TableHeadCell>
            <TableHeadCell>Product name</TableHeadCell>
            <TableHeadCell>Brand name</TableHeadCell>
            <TableHeadCell>Price</TableHeadCell>
            <TableHeadCell>Edit</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {table.map((it, index) => (
            <TableRow key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell
                className="aspect-square"
                children={<Avatar
                  img={it.productImage}
                  size="lg"
                />}
              />
              <TableCell
                className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
                children={it.brandName}
              />
              <TableCell children={it.productName} />
              <TableCell children={"₹" + it.price} />
              <TableCell
                children={
                  <Link
                    to={"/admin/update-product/" + it.id}
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    children={"Edit"}
                  />
                }
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
