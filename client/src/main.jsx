import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
console.error = () => {};
createRoot(document.getElementById("root")).render(<App />);
