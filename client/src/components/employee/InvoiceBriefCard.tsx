import { FC } from 'react'
import { Link } from 'react-router-dom';
import { Card } from 'flowbite-react';
import { InvoiceBriefType } from '../../validator/invoice_brief';
export const InvoiceBriefCard: FC<InvoiceBriefType> = (props: InvoiceBriefType) => {
  return (
    <Card id={props._id} className="w-full hover:scale-90 hover:shadow-2xl hover:dark:shadow-black hover:shadow-gray-600">
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {props.customerEmail}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {new Date(props.dateTime).toLocaleDateString("en-IN")}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {props.ordersCount} Orders
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Total: ₹{props.totalAmount}
      </p>
      <Link
        to={`/employee/print-invoice/${props._id}`}
        className="rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
        children="View Invoice"
      />
    </Card>
  )
}
