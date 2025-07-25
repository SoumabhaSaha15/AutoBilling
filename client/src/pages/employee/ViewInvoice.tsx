import { LuPrinter } from 'react-icons/lu';
import { useParams } from "react-router-dom";
import base from './../../utility/axios-base';
import { HiCheckCircle } from 'react-icons/hi2';
import DownloadInvoice from './DownloadInvoice';
import { FC, useState, useEffect, useMemo } from "react";
import { useToast } from '../../contexts/Toast/ToastContext';
import { Page, PDFDownloadLink, Document, Text } from '@react-pdf/renderer';
import { InvoiceResponseType, InvoiceResponse } from "../../validator/order";
import OutletLoading from '../../OutletLoading';
import { Card, Button, Badge, Table, TableHeadCell, TableHead, Alert, TableBody, TableRow, TableCell } from 'flowbite-react';
import flattenError from './../../utility/zod-error-flattener';
const ViewInvoice: FC = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [invoiceData, setInvoiceData] = useState<InvoiceResponseType | null>(null);
  const { id } = useParams();
  useEffect(() => {
    base.get(`/invoice/${id}`).then((res) => {
      const { data, success, error } = InvoiceResponse.safeParse(res.data);
      (success) ?
        setLoading((_) => {
          setInvoiceData(data);
          return false;
        }) :
        toast.open(flattenError(error), 'alert-error', true, 5000);
    }).catch(console.log);
  }, [id]);

  const pdfDocument = useMemo(() => {
    return (invoiceData) ?
      (<DownloadInvoice {...invoiceData} />) :
      (<Document>
        <Page size="A4" style={{ padding: 20 }}>
          <Text>No invoice data available</Text>
        </Page>
      </Document>);
  }, [invoiceData]);

  return (
    (!loading) ? ((invoiceData !== null) ? (
      <div className="max-w-5xl mx-auto p-6">
        {/* Main Order Card */}
        <Card className="mb-6">
          <div className="p-6">
            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2 dark:text-white">Order Receipt</h1>
                <Badge color="success" size="sm" icon={HiCheckCircle}>
                  Completed
                </Badge>
              </div>
              <div className="flex gap-3 mt-4 sm:mt-0">
                <PDFDownloadLink
                  document={pdfDocument}
                  fileName={`invoice-${invoiceData.id}.pdf`}
                  children={
                    <Button
                      color="blue"
                      size="md"
                      className='rounded-3xl'
                      children={<LuPrinter size='1.2rem' />}
                    />}
                />
              </div>
            </div>

            {/* Order Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gray-300 rounded-lg">
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wide mb-1">
                  Order ID
                </h3>
                <p className="text-lg font-mono font-semibold">
                  #{invoiceData.id}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium  uppercase tracking-wide mb-1">
                  Employee
                </h3>
                <p className="text-lg font-semibold ">
                  {invoiceData.employeeEmail}
                </p>
              </div>
                            <div>
                <h3 className="text-sm font-medium  uppercase tracking-wide mb-1">
                  Customer
                </h3>
                <p className="text-lg font-semibold ">
                  {invoiceData.customerEmail}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Date & Time
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  {(new Date(invoiceData.dateTime)).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Order Items</h2>
              <div className="overflow-x-auto shadow-gray-300 dark:shadow-gray-900 shadow-md rounded-md">
                <Table hoverable>
                  <TableHead>
                    <TableRow>
                      <TableHeadCell className="text-center">Product</TableHeadCell>
                      <TableHeadCell className="text-center">Brand</TableHeadCell>
                      <TableHeadCell className="text-center">Price</TableHeadCell>
                      <TableHeadCell className="text-center">Quantity</TableHeadCell>
                      <TableHeadCell className="text-center">Total</TableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="divide-y">
                    {invoiceData.orders.map((item, index) => (
                      <TableRow key={index} >
                        <TableCell className="whitespace-nowrap text-center font-semibold">
                          {item.productId.productName}
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          {item.productId.brandName}
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          ₹{item.productId.price}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-center font-bold text-blue-600">
                          ₹{item.productId.price * item.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Order Summary</h3>
                    <div className="flex items-center gap-4">
                      <Badge color="purple" size="sm">
                        {invoiceData.orders.length} Items
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Order placed on {new Date(invoiceData.dateTime).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <Alert color="success" icon={HiCheckCircle} className="mb-4">
                <span className="font-medium">Order Completed Successfully!</span> Thank you for your order! We appreciate your business.
              </Alert>
              <p className="text-sm text-gray-500">
                If you have any questions about this order, please contact our support team.
              </p>
            </div>
          </div>
        </Card>

        {/* Additional Cards for Analytics/Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {invoiceData.orders.reduce((total, item) => total + item.quantity, 0)}
              </div>
              <p className="text-sm text-gray-600">Total quantity</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {new Set(invoiceData.orders.map(item => item.productId.brandName)).size}
              </div>
              <p className="text-sm text-gray-600">Unique brands</p>
            </div>
          </Card>
        </div>
      </div>) : (
      <Alert color="failure" icon={HiCheckCircle} className="mb-4">
        <span className="font-medium">
          error in invoice generation
        </span>
      </Alert>
    )
    )
      : <OutletLoading />)
}
export default ViewInvoice;
