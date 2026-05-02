import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext.jsx";
import { ManagerContextProvider } from "./context/ManagerContext.jsx";
import { StaffContextProvider } from "./context/StaffContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <ManagerContextProvider>
        <StaffContextProvider>
          <StrictMode>
            <App />
          </StrictMode>
        </StaffContextProvider>
      </ManagerContextProvider>
    </AppContextProvider>
  </BrowserRouter>
);
