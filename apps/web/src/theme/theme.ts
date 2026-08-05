import type {} from "@mui/material/themeCssVarsAugmentation";
import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: "var(--font-roboto), Arial, sans-serif",
  },
});
