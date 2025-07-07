import { ToastVariantType, ToastVariant } from './ToastContext';
import { ToastContext } from './ToastContext';
import { useState, type ReactNode } from 'react';
import issueFlattener from './../../utility/zod-error-flattener';
import { Toast, ToastToggle } from 'flowbite-react';
import { HiCheck, HiX, HiInformationCircle, } from 'react-icons/hi'; // For different toast icons
import { RiErrorWarningFill } from 'react-icons/ri'; // For different toast icons

export default function ToastProvider({ children }: { children: ReactNode; }) {

  const [toasts, setToasts] = useState<{ component: string; id: string }[]>([]);


  const [toastColor, setToastColor] = useState<ToastVariantType>("alert-info");

  const getIcon = (type: ToastVariantType) => {
    switch (type) {
      case 'alert-success':
        return <HiCheck className="h-5 w-5 bg-green-700" />;
      case 'alert-error':
        return <HiX className="h-5 w-5 bg-red-700" />;
      case 'alert-info':
        return <HiInformationCircle className="h-5 w-5 bg-blue-700" />;
      case 'alert-warning':
        return <RiErrorWarningFill className="h-5 w-5 bg-yellow-700"/>;
      default:
        return <HiInformationCircle className="h-5 w-5 bg-blue-700" />;
    }
  };

  const getColor = (type: ToastVariantType) => {
    switch (type) {
      case 'alert-success':
        return 'green';
      case 'alert-error':
        return 'red';
      case 'alert-info':
        return 'blue';
      case "alert-warning":
        return 'yellow';
      default:
        return 'blue';
    }
  };

  const close = (id: string) => setToasts((toasts) => toasts.filter((toast) => toast.id !== id));

  const open = (component: string, autoClose: boolean = true, timeout: number = 1000, toastVariant: ToastVariantType = "alert-info") => {
    const isValid = ToastVariant.safeParse(toastVariant);
    setToastColor(prev => {
      console.log(prev,isValid.data,getColor(prev));
      return isValid.success ? isValid.data : ((issueFlattener(isValid.error)), prev)
    });
    const id = crypto.randomUUID();
    setToasts((toasts) => [{ id, component }, ...toasts]);
    if (autoClose) setTimeout(() => close(id), timeout);
    return id;
  };

  return (
    <ToastContext.Provider value={{ open, close }}>
      {children}

      <div
        className='fixed bottom-4 right-4 space-y-2 z-[1]'
      >
        {toasts.map(({ id, component }) => (
          <Toast key={id} className={`z-[1] bg-${getColor(toastColor)}-100 border-${getColor(toastColor)}-500`} >
          {/* Apply z-index here */}
            <div className={
              `inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-${getColor(toastColor)}-700 text-black dark:text-white`
            }>
                {getIcon(toastColor)}
            </div>
            <div className="mx-3 text-sm font-normal">
              {component}
            </div>
            <ToastToggle onDismiss={() => setToasts(prevToasts => prevToasts.filter(t => t.id !== id))} />
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
