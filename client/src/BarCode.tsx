
import { Card, TextInput } from "flowbite-react";
import BarCodeScanner, { BarcodeFormat } from "react-qr-barcode-scanner";
import { useState, FC } from "react";


const BarCode: FC = () => {
  const [data, setData] = useState<null | string>(null);
  const [scanning, setScanning] = useState(true);

  return (<>
    <Card
      className="max-w-sm"
    >
      <BarCodeScanner
        width={400}
        height={300}
        delay={2500}
        formats={[BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX]}
        onUpdate={(err, result) => {
          if (result) setData(() => {
            const x = result.getText()
            console.log(x, result.getBarcodeFormat());
            return x;
          });
          else {
            console.log((err as Error).message || "")
            setData(null);
          }
        }}
        stopStream={data ? true : false}
      />
      <TextInput value={data ? data : ''} />

      <p className="font-normal text-gray-700 dark:text-gray-400">
        Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
      </p>
    </Card>
  </>)
}
export default BarCode;
