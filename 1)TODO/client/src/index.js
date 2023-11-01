import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import theme from "./config/theme.js";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./Redux/store";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <App />
          <ToastContainer />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
