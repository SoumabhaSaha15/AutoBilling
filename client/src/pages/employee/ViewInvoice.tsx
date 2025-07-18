import { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import base from './../../utility/axios-base';
import flattener from './../../utility/zod-error-flattener';
import { PDFViewer, Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { InvoiceResponseType, InvoiceResponse } from "../../validator/order";
import styles from "../../utility/invoice-style-pdf";
import { z } from 'zod';
const formatDate = (dateString: string) => Intl.DateTimeFormat("en-IN").format(new Date(dateString));
const ViewInvoice: FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceResponseType | null>(null);
  const [error, serError] = useState<z.ZodError | null>(null);
  const { id } = useParams();
  useEffect(() => {
    base.get(`/invoice/${id}`).then((res) => {
      const { data, success, error } = InvoiceResponse.safeParse(res.data);
      success ? setInvoiceData(data) : serError(error);
    }).catch(console.error);
  }, []);

  return (
    invoiceData !== null ?
      <PDFViewer width={innerWidth} height={innerHeight - 64} >
        <Document title={invoiceData.id} subject="invoice" producer="auto-billing.inc">
          <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Image
                  style={styles.logo}
                  src="/logo.png"
                />
                <Text style={styles.brandName}>Auto Billing</Text>
              </View>
              <View style={styles.headerCenter}>
                <Text style={styles.title}>Orders Reciept</Text>
              </View>
            </View>
            {/* Order Information */}
            <View style={styles.orderInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Order ID:</Text>
                <Text style={styles.infoValue}>{invoiceData.id}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date & Time:</Text>
                <Text style={styles.infoValue}>{formatDate(invoiceData.dateTime)}</Text>
              </View>
            </View>
            {/* Order Items Table */}
            <View style={styles.table}>
              {/* Table Header */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={styles.tableColBrand}>
                  <Text style={styles.tableCellHeader}>Brand</Text>
                </View>
                <View style={styles.tableColProduct}>
                  <Text style={styles.tableCellHeader}>Product</Text>
                </View>
                <View style={styles.tableColPrice}>
                  <Text style={styles.tableCellHeader}>Price</Text>
                </View>
                <View style={styles.tableColQty}>
                  <Text style={styles.tableCellHeader}>Qty</Text>
                </View>
                <View style={styles.tableColTotal}>
                  <Text style={styles.tableCellHeader}>Total</Text>
                </View>
              </View>
              {/* Table Rows */}
              {invoiceData.orders.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableColBrand}>
                    <Text style={styles.tableCell}>{item.productId.brandName}</Text>
                  </View>
                  <View style={styles.tableColProduct}>
                    <Text style={styles.tableCell}>{item.productId.productName}</Text>
                  </View>
                  <View style={styles.tableColPrice}>
                    <Text style={styles.tableCell}>Rs.{item.productId.price}</Text>
                  </View>
                  <View style={styles.tableColQty}>
                    <Text style={styles.tableCell}>{item.quantity}</Text>
                  </View>
                  <View style={styles.tableColTotal}>
                    <Text style={styles.tableCell}>Rs.{(item.productId.price * item.quantity)}</Text>
                  </View>
                </View>
              ))}
            </View>
            {/* Summary */}
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Items:</Text>
                <Text style={styles.summaryValue}>{invoiceData.orders.length}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, styles.grandTotal]}>Grand Total:</Text>
                <Text style={[styles.summaryValue, styles.grandTotal]}>Rs.
                  {invoiceData.orders.reduce((total, item) => (total + (item.productId.price * item.quantity)), 0)}
                </Text>
              </View>
            </View>
            <View style={styles.footer}>
              <Text>Thank you for your order!</Text>
              <Text>Generated on {new Date().toLocaleDateString("en-IN")} by Auto Billing.inc</Text>
            </View>
          </Page>
        </Document>
      </PDFViewer> : (<>{error && flattener(error)}</>)
  );
}
export default ViewInvoice;
