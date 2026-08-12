import "@/index.css";
import App from "@/App.tsx";
import { createRoot } from "react-dom/client";
import { initThemeMode, createTheme, ThemeProvider } from "flowbite-react";
import ToastProvider from "@/contexts/Toast/ToastProvider";

const customTheme = createTheme({
  button: {
    color: {
      primary: "bg-red-500 hover:bg-red-600",
      secondary: "bg-blue-500 hover:bg-blue-600",
    },
    size: {
      lg: "px-6 py-3 text-lg",
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={customTheme}>
    <ToastProvider>
      <App />
    </ToastProvider>
  </ThemeProvider>
);

initThemeMode();
