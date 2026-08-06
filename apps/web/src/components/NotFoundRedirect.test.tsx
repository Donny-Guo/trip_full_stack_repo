import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import AppThemeProvider from "../theme/AppThemeProvider";
import NotFoundRedirect from "./NotFoundRedirect";

const { replace, router } = vi.hoisted(() => {
  const replace = vi.fn();
  return { replace, router: { replace } };
});

vi.mock("next/navigation", () => ({
  useRouter: () => router,
}));

describe("NotFoundRedirect", () => {
  beforeEach(() => {
    replace.mockReset();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    ["/login", "sign in"],
    ["/dashboard", "dashboard"],
  ] as const)(
    "replaces the missing route with %s after five seconds",
    async (destination, destinationLabel) => {
      render(
        <AppThemeProvider>
          <NotFoundRedirect
            destination={destination}
            destinationLabel={destinationLabel}
          />
        </AppThemeProvider>,
      );

      expect(screen.getByRole("status")).toHaveTextContent(
        `Redirecting to ${destinationLabel} in 5 seconds.`,
      );
      expect(
        screen.getByRole("link", { name: `Go to ${destinationLabel} now` }),
      ).toHaveAttribute("href", destination);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(5_000);
      });

      expect(replace).toHaveBeenCalledOnce();
      expect(replace).toHaveBeenCalledWith(destination);
    },
  );

  it("lets the user cancel the automatic context change", async () => {
    render(
      <AppThemeProvider>
        <NotFoundRedirect destination="/login" destinationLabel="sign in" />
      </AppThemeProvider>,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Cancel automatic redirect" }),
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Automatic redirect canceled.",
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5_000);
    });

    expect(replace).not.toHaveBeenCalled();
  });
});
