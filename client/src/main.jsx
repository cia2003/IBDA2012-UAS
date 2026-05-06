import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext.jsx";
import { ManagerContextProvider } from "./context/ManagerContext.jsx";
import { StaffContextProvider } from "./context/StaffContext.jsx";
import { UserContextProvider } from "./context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <ManagerContextProvider>
        <StaffContextProvider>
          <UserContextProvider>
            <StrictMode>
              <App />
            </StrictMode>
          </UserContextProvider>
        </StaffContextProvider>
      </ManagerContextProvider>
    </AppContextProvider>
  </BrowserRouter>
);
