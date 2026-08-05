import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AppThemeProvider from "../theme/AppThemeProvider";
import { appTheme } from "../theme/theme";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders semantic content through the CSS-variable theme", () => {
    render(
      <AppThemeProvider>
        <HomePage />
      </AppThemeProvider>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Trip Agent" }),
    ).toBeVisible();
    expect(appTheme.typography.fontFamily).toContain("--font-roboto");
    expect(appTheme.vars.palette.primary.main).toContain(
      "--mui-palette-primary-main",
    );
  });
});
