import { Alert, Button, Container, Stack, Typography } from "@mui/material";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getSessionStatus } from "@/features/auth/server/session";

function SessionUnavailable(): React.ReactElement {
  return (
    <Container component="main" maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
        <Typography component="h1" variant="h4">
          Session unavailable
        </Typography>
        <Alert severity="error">
          We could not verify your session. Try again when the API is available.
        </Alert>
        <Button component="a" href="/dashboard" variant="outlined">
          Try again
        </Button>
      </Stack>
    </Container>
  );
}

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: ReactNode }>): Promise<React.ReactElement> {
  const session = await getSessionStatus();

  if (session.kind === "unauthenticated") {
    redirect("/login?returnTo=%2Fdashboard");
  }

  if (session.kind === "unavailable") {
    return <SessionUnavailable />;
  }

  return <>{children}</>;
}
