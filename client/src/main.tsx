import { initThemeMode } from "flowbite-react";
import ToastProvider from "./context/Toast/ToastProvider";
import AuthProvider from "./context/Auth/AuthProvider.tsx";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </AuthProvider>
);

initThemeMode();
