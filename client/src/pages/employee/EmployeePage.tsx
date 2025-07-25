import { FC, useState, useEffect } from "react";
import base from "./../../utility/axios-base";
import { useToast } from "../../contexts/Toast/ToastContext";
import { InvoiceBriefCard } from '../../components/employee/InvoiceBriefCard';
import { InvoiceBriefListType, InvoiceBriefList } from "../../validator/invoice_brief";
import OutletLoading from "../../OutletLoading";
import flattener from "./../../utility/zod-error-flattener"
const EmployeePage: FC = () => {
  const toast = useToast();
  const [invoiceList, setInvoiceList] = useState<InvoiceBriefListType>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    base.get('/invoice').then((res) => {
      const { data, success, error } = InvoiceBriefList.safeParse(res.data);
      if (success) {
        setLoading((_) => {
          setInvoiceList(data);
          return false;
        });
      } else {
        toast.open(flattener(error), 'alert-error', true, 5000);
      }
    })
  }, []);
  return !loading ? (<div className="min-h-[calc(100dvh-64px)] grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 items-center p-2 justify-center place-items-center">
    {invoiceList.map(data => <InvoiceBriefCard {...data} key={data._id}/>)}
  </div>) : (<OutletLoading />);
}
export default EmployeePage
