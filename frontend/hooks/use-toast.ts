import * as React from "react";
import { Toast, ToastAction, ToastDescription, ToastTitle, Toaster } from "@/components/ui/toast";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  duration?: number;
  variant?: "default" | "destructive";
};

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = React.useCallback((props: ToastProps) => {
    setToasts((prev) => [...prev, props]);
  }, []);

  return {
    toast,
    toasts,
  };
}

export { Toast, ToastAction, ToastDescription, ToastTitle, Toaster };
