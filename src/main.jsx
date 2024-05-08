import { ConfigProvider, theme } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        components: {
          Typography: {
            fontFamily: "Lexend, sans-serif",
          },
          Button: {
            colorPrimary: "#00b96b",
            algorithm: true,
          },
          FloatButton: {
            colorPrimary: "#00b96b",
            algorithm: true,
          }
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
