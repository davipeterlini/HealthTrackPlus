import { createRoot } from "react-dom/client";
import { preloadImportantChunks } from "./lib/bundle-optimization";
import App from "./App";
import "./index.css";
import './i18n';

// Initialize bundle optimizations
preloadImportantChunks();

createRoot(document.getElementById("root")!).render(<App />);
