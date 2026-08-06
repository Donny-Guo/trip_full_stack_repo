"use client";

import NextLinkClient from "@/components/NextLinkClient";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useEffect, useMemo, useRef, useState } from "react";

import { login, signUp } from "./auth-api";
import { presentAuthFailure } from "./auth-errors";
import type { SafeReturnPath } from "./return-path";
import {
  type AuthFieldErrors,
  type AuthMode,
  getPasswordRequirements,
  normalizeEmailForSubmission,
  validateAuthFields,
} from "./auth-validation";

interface AuthFormProps {
  readonly mode: AuthMode;
  readonly returnTo: SafeReturnPath;
}

export default function AuthForm({
  mode,
  returnTo,
}: AuthFormProps): React.ReactElement {
  const router = useRouter();
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const alert = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const isSignUp = mode === "sign-up";
  const requirements = useMemo(
    () => getPasswordRequirements(password),
    [password],
  );
  const metRequirementCount = requirements.filter(({ met }) => met).length;

  useEffect(() => {
    if (formError !== undefined) alert.current?.focus();
  }, [formError]);

  function refreshVisibleErrors(nextEmail: string, nextPassword: string): void {
    const nextErrors = validateAuthFields(mode, nextEmail, nextPassword);
    setFieldErrors({
      ...(touched.email && nextErrors.email !== undefined
        ? { email: nextErrors.email }
        : {}),
      ...(touched.password && nextErrors.password !== undefined
        ? { password: nextErrors.password }
        : {}),
    });
  }

  function updateFieldError(
    field: "email" | "password",
    error: string | undefined,
  ): void {
    setFieldErrors((current) => {
      const next = { ...current };
      if (error === undefined) delete next[field];
      else next[field] = error;
      return next;
    });
  }

  function focusFirstError(errors: AuthFieldErrors): void {
    if (errors.email !== undefined) emailInput.current?.focus();
    else if (errors.password !== undefined) passwordInput.current?.focus();
  }

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (submitting) return;

    setTouched({ email: true, password: true });
    setFormError(undefined);
    const clientErrors = validateAuthFields(mode, email, password);
    setFieldErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      focusFirstError(clientErrors);
      return;
    }

    setSubmitting(true);
    const normalizedEmail = normalizeEmailForSubmission(email);
    const result = isSignUp
      ? await signUp(normalizedEmail, password)
      : await login(normalizedEmail, password);

    if (result.ok) {
      router.replace(isSignUp ? "/dashboard" : returnTo);
      router.refresh();
      return;
    }

    const presented = presentAuthFailure(mode, result.failure);
    setFieldErrors(presented.fieldErrors);
    setFormError(presented.formError);
    setSubmitting(false);
    if (presented.formError === undefined) {
      focusFirstError(presented.fieldErrors);
    }
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography component="h1" variant="h4">
          {isSignUp ? "Create account" : "Sign in"}
        </Typography>
        <Typography color="text.secondary">
          {isSignUp
            ? "Use your email and a password."
            : "Use your account email and password."}
        </Typography>
      </Stack>

      {formError === undefined ? null : (
        <Alert ref={alert} severity="error" tabIndex={-1} role="alert">
          {formError}
        </Alert>
      )}

      <Stack
        component="form"
        noValidate
        spacing={2}
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        <TextField
          id={`${mode}-email`}
          inputRef={emailInput}
          label="Email"
          type="email"
          name="email"
          value={email}
          required
          fullWidth
          autoComplete="email"
          error={fieldErrors.email !== undefined}
          helperText={fieldErrors.email ?? "Use the email for your account."}
          disabled={submitting}
          onBlur={() => {
            setTouched((current) => ({ ...current, email: true }));
            const nextErrors = validateAuthFields(mode, email, password);
            updateFieldError("email", nextErrors.email);
          }}
          onChange={(event) => {
            const nextEmail = event.target.value;
            setEmail(nextEmail);
            setFormError(undefined);
            refreshVisibleErrors(nextEmail, password);
          }}
          slotProps={{
            htmlInput: {
              autoCapitalize: "none",
              spellCheck: false,
            },
          }}
        />

        <TextField
          id={`${mode}-password`}
          inputRef={passwordInput}
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          required
          fullWidth
          autoComplete={isSignUp ? "new-password" : "current-password"}
          error={fieldErrors.password !== undefined}
          helperText={
            fieldErrors.password ??
            (isSignUp
              ? "Use the checklist below."
              : "Enter your current password.")
          }
          disabled={submitting}
          onBlur={() => {
            setTouched((current) => ({ ...current, password: true }));
            const nextErrors = validateAuthFields(mode, email, password);
            updateFieldError("password", nextErrors.password);
          }}
          onChange={(event) => {
            const nextPassword = event.target.value;
            setPassword(nextPassword);
            setFormError(undefined);
            refreshVisibleErrors(email, nextPassword);
          }}
          slotProps={{
            htmlInput: {
              "aria-describedby": isSignUp
                ? `${mode}-password-helper-text password-requirements`
                : `${mode}-password-helper-text`,
            },
            formHelperText: {
              id: `${mode}-password-helper-text`,
            },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    disabled={submitting}
                    edge="end"
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? (
                      <VisibilityOffOutlined />
                    ) : (
                      <VisibilityOutlined />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {isSignUp ? (
          <Stack spacing={0.5}>
            <Typography variant="caption" aria-live="polite" aria-atomic="true">
              {metRequirementCount} of {requirements.length} requirements met
            </Typography>
            <Stack
              id="password-requirements"
              component="ul"
              aria-label="Password requirements"
              spacing={0.5}
              sx={{ m: 0, pl: 3 }}
            >
              {requirements.map((requirement) => (
                <Typography
                  component="li"
                  variant="body2"
                  color={requirement.met ? "success.main" : "text.secondary"}
                  key={requirement.id}
                  aria-label={`${
                    requirement.met ? "Met" : "Not met"
                  }: ${requirement.label}`}
                >
                  {requirement.met ? "✓" : "–"} {requirement.label}
                </Typography>
              ))}
            </Stack>
          </Stack>
        ) : null}

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={submitting}
        >
          {submitting
            ? isSignUp
              ? "Creating account…"
              : "Signing in…"
            : isSignUp
              ? "Create account"
              : "Sign in"}
        </Button>
      </Stack>

      <Typography>
        {isSignUp ? "Already have an account? " : "Need an account? "}
        <Link
          component={NextLinkClient}
          href={isSignUp ? "/login" : "/sign-up"}
        >
          {isSignUp ? "Sign in" : "Create one"}
        </Link>
      </Typography>
    </Stack>
  );
}
