import { createContext, useContext, type Context } from "react";
import { z } from 'zod';
export const ToastVariant= z.enum(['alert-info', 'alert-success', 'alert-warning', 'alert-error']);
export type ToastVariantType = z.infer<typeof ToastVariant>;
export type ToastContextProps = {
  /**
   * @param component string message to be displayed in the toast
   * @param autoClose? boolean if true, the toast will close automatically after the timeout
   * @param timeout? number the time in ms after which the toast will close default is 1000ms
   * @param toastOptions ToastOptionsType the options for the toast customization alert-info is the default variant
   * @returns string
   */
  open: (component: string, autoClose?: boolean, timeout?: number, toastVariant?:ToastVariantType) => string;
  close: (id: string) => void;
};
export const ToastContext: Context<ToastContextProps> = createContext<ToastContextProps>({
  open: (
    component: string,
    autoClose: boolean = true,
    timeout: number = 1000,
    toastVariant:ToastVariantType = "alert-info"
  ) => {
    console.log(component, timeout, toastVariant, autoClose);
    return '';
  },
  close: (id: string) => { console.log(id); },
});
export const useToast = () => useContext(ToastContext);
