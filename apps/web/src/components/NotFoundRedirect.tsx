"use client";

import { Button, Container, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const REDIRECT_DELAY_SECONDS = 5;

interface NotFoundRedirectProps {
  readonly destination: "/dashboard" | "/login";
  readonly destinationLabel: "dashboard" | "sign in";
}

export default function NotFoundRedirect({
  destination,
  destinationLabel,
}: NotFoundRedirectProps): React.ReactElement {
  const router = useRouter();
  const [secondsRemaining, setSecondsRemaining] = useState(
    REDIRECT_DELAY_SECONDS,
  );
  const [isRedirectCancelled, setIsRedirectCancelled] = useState(false);

  useEffect(() => {
    if (isRedirectCancelled) return;

    const countdownId = window.setInterval(() => {
      setSecondsRemaining((current) => Math.max(0, current - 1));
    }, 1_000);
    const redirectId = window.setTimeout(() => {
      window.clearInterval(countdownId);
      router.replace(destination);
    }, REDIRECT_DELAY_SECONDS * 1_000);

    return () => {
      window.clearInterval(countdownId);
      window.clearTimeout(redirectId);
    };
  }, [destination, isRedirectCancelled, router]);

  return (
    <Container component="main" maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
        <Typography component="h1" variant="h4">
          Page not found
        </Typography>
        <Typography role="status" aria-live="polite">
          {isRedirectCancelled
            ? "Automatic redirect canceled."
            : `Redirecting to ${destinationLabel} in ${secondsRemaining} seconds.`}
        </Typography>
        <Button
          type="button"
          variant="text"
          disabled={isRedirectCancelled}
          onClick={() => setIsRedirectCancelled(true)}
        >
          {isRedirectCancelled
            ? "Automatic redirect canceled"
            : "Cancel automatic redirect"}
        </Button>
        <Button component="a" href={destination} variant="outlined">
          Go to {destinationLabel} now
        </Button>
      </Stack>
    </Container>
  );
}
