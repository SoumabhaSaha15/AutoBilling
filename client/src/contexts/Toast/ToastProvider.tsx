import Loading from './../../Loading'; // Importing Loading component for fallback
import { ToastContext } from './ToastContext';
import { RiErrorWarningFill } from 'react-icons/ri'; // For different toast icons
import { Toast, ToastToggle } from 'flowbite-react';
import { useState, type ReactNode, Suspense } from 'react';
import { ToastVariantType, ToastVariant } from './ToastContext';
import issueFlattener from './../../utility/zod-error-flattener';
import { HiCheck, HiX, HiInformationCircle, } from 'react-icons/hi'; // For different toast icons

export default function ToastProvider({ children }: { children: ReactNode; }) {

  const [toasts, setToasts] = useState<{ component: string; id: string, variant: ToastVariantType }[]>([]);

  const [toastColor, setToastColor] = useState<ToastVariantType>("alert-info");

  const toastConfig = {
    'alert-success': {
      icon: <HiCheck className="h-5 w-5 bg-green-700" />,
      color: 'green'
    },
    'alert-error': {
      icon: <HiX className="h-5 w-5 bg-red-700" />,
      color: 'red'
    },
    'alert-info': {
      icon: <HiInformationCircle className="h-5 w-5 bg-blue-700" />,
      color: 'blue'
    },
    'alert-warning': {
      icon: <RiErrorWarningFill className="h-5 w-5 bg-yellow-700" />,
      color: 'yellow'
    }
  };

  const getIcon = (type: ToastVariantType) => {
    return toastConfig[type]?.icon || toastConfig['alert-info'].icon;
  };

  const getColor = (type: ToastVariantType) => {
    return toastConfig[type]?.color || toastConfig['alert-info'].color;
  };

  const close = (id: string) => setToasts((toasts) => toasts.filter((toast) => toast.id !== id));

  const open = (component: string, toastVariant: ToastVariantType = "alert-info", autoClose: boolean = true, timeout: number = 1000) => {
    const isValid = ToastVariant.safeParse(toastVariant);
    setToastColor(prev => {
      return isValid.success ? isValid.data : ((issueFlattener(isValid.error)), prev)
    });

    const id = crypto.randomUUID();
    setToasts((toasts) => [{ id, component, variant: toastVariant }, ...toasts]);
    if (autoClose) setTimeout(() => close(id), timeout);
    return id;
  };

  return (
    <ToastContext.Provider value={{ open, close }}>
      < Suspense
        fallback={<Loading />}
        children={children}
      />
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
