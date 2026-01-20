import { FC } from 'react';
import { createTw } from "react-pdf-tailwind";
import { type InvoiceResponseType } from '../../validator/order';
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";

// 1. Initialize Tailwind for PDF
const tw = createTw({
  theme: {
    extend: {
      colors: {
        brandBlue: "#0066cc",
        headerGray: "#f5f5f5",
        borderGray: "#cccccc",
      },
    },
  },
});

const DownloadInvoice: FC<InvoiceResponseType> = (props) => {
  const grandTotal = props.orders.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <Document title={props.id} subject="invoice" producer="auto-billing.inc">
      <Page size="A4" style={tw("p-8 bg-white font-sans flex-col")}>

        {/* Header */}
        <View style={tw("flex-row items-center border-b border-borderGray pb-4 mb-5")}>
          <View style={tw("w-1/3 items-start")}>
            <Image style={tw("w-16 h-16 mb-1")} src="/logo.png" />
            <Text style={tw("text-[10px] font-bold text-gray-800")}>Auto Billing</Text>
          </View>
          <View style={tw("w-2/3 items-start")}>
            <Text style={tw("text-2xl font-bold")}>Orders Receipt</Text>
          </View>
        </View>

        {/* Order Information */}
        <View style={tw("mb-5 text-[10px]")}>
          <View style={tw("flex-row mb-1")}>
            <Text style={tw("w-24 font-bold text-gray-500")}>Order ID:</Text>
            <Text>{props.id}</Text>
          </View>
          <View style={tw("flex-row mb-1")}>
            <Text style={tw("w-24 font-bold text-gray-500")}>Date & Time:</Text>
            <Text>{new Date(props.dateTime).toLocaleString('en-IN')}</Text>
          </View>
          <View style={tw("flex-row mb-1")}>
            <Text style={tw("w-24 font-bold text-gray-500")}>Customer:</Text>
            <Text>{props.customerEmail}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={tw("border border-borderGray mb-5")}>
          {/* Table Header */}
          <View style={tw("flex-row bg-headerGray border-b border-borderGray min-h-[25px] font-bold text-[10px]")}>
            <Text style={tw("w-[20%] p-1 border-r border-borderGray")}>Brand</Text>
            <Text style={tw("w-[35%] p-1 border-r border-borderGray")}>Product</Text>
            <Text style={tw("w-[15%] p-1 border-r border-borderGray text-center")}>Price</Text>
            <Text style={tw("w-[15%] p-1 border-r border-borderGray text-center")}>Qty</Text>
            <Text style={tw("w-[15%] p-1 text-center")}>Total</Text>
          </View>

          {/* Table Rows */}
          {props.orders.map((item, index) => (
            <View key={index} style={tw("flex-row border-b border-borderGray min-h-[25px] text-[10px]")}>
              <Text style={tw("w-[20%] p-1 border-r border-borderGray")}>{item.productId.brandName}</Text>
              <Text style={tw("w-[35%] p-1 border-r border-borderGray")}>{item.productId.productName}</Text>
              <Text style={tw("w-[15%] p-1 border-r border-borderGray text-center")}>Rs.{item.price}</Text>
              <Text style={tw("w-[15%] p-1 border-r border-borderGray text-center")}>{item.quantity}</Text>
              <Text style={tw("w-[15%] p-1 text-center")}>Rs.{item.price * item.quantity}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={tw("mt-5 border-t border-borderGray pt-2")}>
          <View style={tw("flex-row justify-between mb-1")}>
            <Text style={tw("text-xs font-bold")}>Total Items:</Text>
            <Text style={tw("text-xs")}>{props.orders.length}</Text>
          </View>
          <View style={tw("flex-row justify-between mt-2")}>
            <Text style={tw("text-base font-bold text-brandBlue")}>Grand Total:</Text>
            <Text style={tw("text-base font-bold text-brandBlue")}>Rs.{grandTotal}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={tw("mt-8 text-center text-[10px] text-gray-500")}>
          <Text>Thank you for your order!</Text>
          <Text>Generated on {new Date().toLocaleDateString("en-IN")} by Auto Billing.inc</Text>
        </View>
      </Page>
    </Document>
  );
};

export default DownloadInvoice;
