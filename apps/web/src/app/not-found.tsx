import { Alert, Button, Container, Stack, Typography } from "@mui/material";

import NotFoundRedirect from "@/components/NotFoundRedirect";
import { getSessionStatus } from "@/features/auth/server/session";

export default async function NotFound(): Promise<React.ReactElement> {
  const session = await getSessionStatus();

  if (session.kind === "unavailable") {
    return (
      <Container component="main" maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
        <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
          <Typography component="h1" variant="h4">
            Page not found
          </Typography>
          <Alert severity="warning">
            We could not verify your session, so you were not redirected.
          </Alert>
          <Button component="a" href="/login" variant="outlined">
            Go to sign in
          </Button>
        </Stack>
      </Container>
    );
  }

  const isAuthenticated = session.kind === "authenticated";

  return (
    <NotFoundRedirect
      destination={isAuthenticated ? "/dashboard" : "/login"}
      destinationLabel={isAuthenticated ? "dashboard" : "sign in"}
    />
  );
}
