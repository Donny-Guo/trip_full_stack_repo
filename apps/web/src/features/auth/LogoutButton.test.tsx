import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import AppThemeProvider from "../../theme/AppThemeProvider";
import LogoutButton from "./LogoutButton";

const { replace, refresh } = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh }),
}));

function renderButton(): void {
  render(
    <AppThemeProvider>
      <LogoutButton />
    </AppThemeProvider>,
  );
}

describe("LogoutButton", () => {
  beforeEach(() => {
    replace.mockReset();
    refresh.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("logs out once and replaces the private route", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderButton();

    await user.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/login"));
    expect(replace).toHaveBeenCalledOnce();
    expect(refresh).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/auth/logout",
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
        body: "{}",
      }),
    );
  });

  it("announces a failure and permits a retry", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError("offline"));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderButton();

    await user.click(screen.getByRole("button", { name: "Log out" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("We could not log you out. Try again.");
    expect(alert).toHaveFocus();
    const retry = screen.getByRole("button", { name: "Log out" });
    expect(retry).toBeEnabled();

    await user.click(retry);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(replace).not.toHaveBeenCalled();
  });
});
