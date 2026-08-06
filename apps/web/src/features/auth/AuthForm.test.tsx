import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import AppThemeProvider from "../../theme/AppThemeProvider";
import AuthForm from "./AuthForm";

const { replace, refresh } = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
}));

const EMAIL_LABEL = /^Email\s*\*?$/;
const PASSWORD_LABEL = /^Password\s*\*?$/;

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh }),
}));

function renderForm(mode: "login" | "sign-up" = "sign-up"): void {
  render(
    <AppThemeProvider>
      <AuthForm mode={mode} returnTo="/dashboard" />
    </AppThemeProvider>,
  );
}

function apiError(
  status: number,
  code: string,
  fieldErrors?: Readonly<Record<string, readonly string[]>>,
): Response {
  return new Response(
    JSON.stringify({
      code,
      message: "Safe API fallback.",
      requestId: "00000000-0000-4000-8000-000000000001",
      ...(fieldErrors === undefined ? {} : { fieldErrors }),
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    },
  );
}

function signUpSuccess(): Response {
  return new Response(
    JSON.stringify({
      messageCode: "AUTH_SIGN_UP_SUCCEEDED",
      user: {
        id: "00000000-0000-4000-8000-000000000001",
        email: "person@example.com",
        createdAt: "2026-08-06T12:00:00.000Z",
        updatedAt: "2026-08-06T12:00:00.000Z",
      },
    }),
    {
      status: 201,
      headers: { "Content-Type": "application/json" },
    },
  );
}

describe("AuthForm", () => {
  beforeEach(() => {
    replace.mockReset();
    refresh.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows accessible local errors and does not submit empty sign-up", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(screen.getByLabelText(EMAIL_LABEL)).toHaveFocus();
    expect(screen.getByText("Enter your email.")).toBeVisible();
    expect(screen.getByText("Enter your password.")).toBeVisible();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("updates the sign-up password checklist immediately", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(PASSWORD_LABEL), "TripDemo9@Qz");

    expect(screen.getByLabelText("Met: One uppercase letter")).toBeVisible();
    expect(screen.getByLabelText("Met: One lowercase letter")).toBeVisible();
    expect(screen.getByLabelText("Met: One number")).toBeVisible();
    expect(screen.getByLabelText("Met: One of $ # @ %")).toBeVisible();
  });

  it("submits once and navigates after successful sign-up", async () => {
    const fetchMock = vi.fn().mockResolvedValue(signUpSuccess());
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(EMAIL_LABEL), "Person@Example.com");
    await user.type(screen.getByLabelText(PASSWORD_LABEL), "TripDemo9@Qz");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/dashboard"));
    expect(replace).toHaveBeenCalledOnce();
    expect(refresh).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/auth/sign-up",
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify({
          email: "person@example.com",
          password: "TripDemo9@Qz",
        }),
      }),
    );
  });

  it("maps duplicate registration by code without parsing API prose", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(apiError(409, "EMAIL_ALREADY_EXISTS")),
    );
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(EMAIL_LABEL), "person@example.com");
    await user.type(screen.getByLabelText(PASSWORD_LABEL), "TripDemo9@Qz");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "An account with that email already exists.",
    );
    expect(alert).toHaveFocus();
  });

  it("shows the same public login message for INVALID_CREDENTIALS", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(apiError(401, "INVALID_CREDENTIALS")),
    );
    const user = userEvent.setup();
    renderForm("login");

    await user.type(screen.getByLabelText(EMAIL_LABEL), "person@example.com");
    await user.type(screen.getByLabelText(PASSWORD_LABEL), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Email or password is invalid.");
    expect(alert).toHaveFocus();
  });

  it("recovers from a network failure and permits another submission", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    const user = userEvent.setup();
    renderForm("login");

    await user.type(screen.getByLabelText(EMAIL_LABEL), "person@example.com");
    await user.type(screen.getByLabelText(PASSWORD_LABEL), "legacy password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      await screen.findByText(
        "We could not reach the authentication service. Try again.",
      ),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeEnabled();
  });

  it("does not navigate after a malformed success response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("{}", {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(EMAIL_LABEL), "person@example.com");
    await user.type(screen.getByLabelText(PASSWORD_LABEL), "TripDemo9@Qz");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(
      await screen.findByText(
        "The service returned an unexpected response. Try again.",
      ),
    ).toBeVisible();
    expect(replace).not.toHaveBeenCalled();
  });

  it("keeps timeout and upstream failures distinct", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new DOMException("Timed out", "TimeoutError"))
      .mockResolvedValueOnce(
        new Response("<html>unavailable</html>", {
          status: 503,
          headers: { "Content-Type": "text/html" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderForm("login");

    await user.type(screen.getByLabelText(EMAIL_LABEL), "person@example.com");
    await user.type(screen.getByLabelText(PASSWORD_LABEL), "legacy password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      await screen.findByText("The request took too long. Try again."),
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(
      await screen.findByText(
        "The authentication service is unavailable. Try again.",
      ),
    ).toBeVisible();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("rejects malformed JSON and focuses the fallback alert", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("{", {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );
    const user = userEvent.setup();
    renderForm("login");

    await user.type(screen.getByLabelText(EMAIL_LABEL), "person@example.com");
    await user.type(screen.getByLabelText(PASSWORD_LABEL), "legacy password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "The service returned an unexpected response. Try again.",
    );
    expect(alert).toHaveFocus();
  });

  it("focuses the safe request-ID fallback for an unknown field code", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        apiError(400, "VALIDATION_ERROR", {
          password: ["FUTURE_PASSWORD_CODE"],
        }),
      ),
    );
    const user = userEvent.setup();
    renderForm("login");

    await user.type(screen.getByLabelText(EMAIL_LABEL), "person@example.com");
    await user.type(screen.getByLabelText(PASSWORD_LABEL), "legacy password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "Reference: 00000000-0000-4000-8000-000000000001",
    );
    expect(alert).toHaveFocus();
  });

  it("supports paste, password visibility, and Enter submission", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(signUpSuccess()));
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(EMAIL_LABEL), "person@example.com");
    const passwordInput = screen.getByLabelText(PASSWORD_LABEL);
    await user.click(passwordInput);
    await user.paste("TripDemo9@Qz");
    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(passwordInput).toHaveAttribute("type", "text");
    await user.type(passwordInput, "{Enter}");

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/dashboard"));
    expect(replace).toHaveBeenCalledOnce();
  });

  it("blocks a duplicate submission while the first request is pending", async () => {
    const pendingResponse = Promise.withResolvers<Response>();
    const fetchMock = vi.fn().mockReturnValue(pendingResponse.promise);
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(EMAIL_LABEL), "person@example.com");
    await user.type(screen.getByLabelText(PASSWORD_LABEL), "TripDemo9@Qz");
    const submit = screen.getByRole("button", { name: "Create account" });
    await user.click(submit);
    expect(submit).toBeDisabled();
    submit.click();
    expect(fetchMock).toHaveBeenCalledOnce();

    pendingResponse.resolve(signUpSuccess());
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/dashboard"));
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("keeps the expected keyboard focus order", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.tab();
    expect(screen.getByLabelText(EMAIL_LABEL)).toHaveFocus();
    await user.tab();
    expect(screen.getByLabelText(PASSWORD_LABEL)).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Show password" })).toHaveFocus();
    await user.tab();
    expect(
      screen.getByRole("button", { name: "Create account" }),
    ).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveFocus();
  });
});
