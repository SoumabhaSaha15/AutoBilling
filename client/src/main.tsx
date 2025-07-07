import { initThemeMode } from "flowbite-react";
import ToastProvider from "./context/Toast/ToastProvider";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
createRoot(document.getElementById("root")!).render(
  <ToastProvider>
    <App />
  </ToastProvider>
);

initThemeMode();
