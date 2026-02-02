import "./index.css";
import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { initThemeMode } from "flowbite-react";
import ToastProvider from "./contexts/Toast/ToastProvider";

createRoot(document.getElementById("root")!).render(
  <ToastProvider>
    <App />
  </ToastProvider>
);

initThemeMode();
