import { FC } from 'react';
import { InvoiceResponseType } from '../../validator/order';
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: {
    width: '30%',
    alignItems: 'flex-start',
  },
  headerCenter: {
    width: '70%',
    alignItems: 'flex-start',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  brandName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  orderInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    width: 100,
    color: '#666666',
  },
  infoValue: {
    fontSize: 10,
    flex: 1,
    color: '#000000',
  },
  table: {
    // display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cccccc',
    marginBottom: 20,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    minHeight: 25,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
  },
  tableColProduct: {
    width: '35%',
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
    padding: 5,
  },
  tableColBrand: {
    width: '20%',
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
    padding: 5,
  },
  tableColPrice: {
    width: '15%',
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
    padding: 5,
    textAlign: 'center',
  },
  tableColQty: {
    width: '15%',
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
    padding: 5,
    textAlign: 'center',
  },
  tableColTotal: {
    width: '15%',
    padding: 5,
    textAlign: 'center',
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
  },
  tableCell: {
    fontSize: 10,
    color: '#000000',
  },
  summary: {
    marginTop: 20,
    borderTop: 1,
    borderTopColor: '#cccccc',
    paddingTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
  },
  summaryValue: {
    fontSize: 12,
    color: '#000000',
  },
  grandTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
  },
});

const DownloadInvoice: FC<InvoiceResponseType> = (props: InvoiceResponseType) => {
  return (
    <Document title={props.id} subject="invoice" producer="auto-billing.inc">
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
            <Text style={styles.infoValue}>{props.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date & Time:</Text>
            <Text style={styles.infoValue}>{(new Date(props.dateTime)).toLocaleString('en-IN')}</Text>
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
          {props.orders.map((item, index) => (
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
            <Text style={styles.summaryValue}>{props.orders.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, styles.grandTotal]}>Grand Total:</Text>
            <Text style={[styles.summaryValue, styles.grandTotal]}>Rs.
              {props.orders.reduce((total, item) => (total + (item.productId.price * item.quantity)), 0)}
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text>Thank you for your order!</Text>
          <Text>Generated on {new Date().toLocaleDateString("en-IN")} by Auto Billing.inc</Text>
        </View>
      </Page>
    </Document>
  )
}

export default DownloadInvoice;
