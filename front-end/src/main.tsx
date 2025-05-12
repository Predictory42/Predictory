import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Providers } from "@/providers";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers />
  </StrictMode>,
);

//1 sorting
//2 optionIndex
//3 withdraw stake
//4 result
