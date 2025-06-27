// import { BarcodeFormat } from "react-qr-barcode-scanner";
import BarCodeScanner, { BarcodeFormat } from "react-qr-barcode-scanner";
import React from "react";
const BarCode: React.FC = () => {
  const [data, setData] = React.useState<null | string>(null);

  return (<>
    <BarCodeScanner
      width={500}
      height={500}
      delay={2500}
      formats={[BarcodeFormat.EAN_13]}
      onUpdate={(err, result) => {
        if (result) setData(() => {
          const x = result.getText()
          console.log(x,result.getBarcodeFormat());
          return x;
        });
        else {
          console.log((err as Error).message || "")
          setData(null);
        }
      }}
      stopStream={data ? true : false}
    />
    {data}
  </>)
}
export default BarCode;