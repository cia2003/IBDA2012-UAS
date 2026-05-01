import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext.jsx";
import { ManagerContextProvider } from "./context/ManagerContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <ManagerContextProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </ManagerContextProvider>
    </AppContextProvider>
  </BrowserRouter>,
);
