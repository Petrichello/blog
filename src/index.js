import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";

import App from "./App";
import { store } from "./store/indexStore";
import "@ant-design/v5-patch-for-react-19";

const app = document.getElementById("root");
const root = createRoot(app);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
