"use client";

import { Alert, Button, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { logout } from "./auth-api";

export default function LogoutButton(): React.ReactElement {
  const router = useRouter();
  const alert = useRef<HTMLDivElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (error !== undefined) alert.current?.focus();
  }, [error]);

  async function handleLogout(): Promise<void> {
    if (submitting) return;
    setSubmitting(true);
    setError(undefined);

    const result = await logout();
    if (result.ok) {
      router.replace("/login");
      router.refresh();
      return;
    }

    setError("We could not log you out. Try again.");
    setSubmitting(false);
  }

  return (
    <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
      {error === undefined ? null : (
        <Alert ref={alert} severity="error" tabIndex={-1} role="alert">
          {error}
        </Alert>
      )}
      <Button
        type="button"
        variant="outlined"
        disabled={submitting}
        onClick={() => {
          void handleLogout();
        }}
      >
        {submitting ? "Logging out…" : "Log out"}
      </Button>
    </Stack>
  );
}
