"use client";

import { Alert, Button, Container, Stack, Typography } from "@mui/material";

interface ProtectedErrorProps {
  readonly error: Error & { readonly digest?: string };
  readonly reset: () => void;
}

export default function ProtectedError({ reset }: ProtectedErrorProps) {
  return (
    <Container component="main" maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
        <Typography component="h1" variant="h4">
          Something went wrong
        </Typography>
        <Alert severity="error">
          The protected page could not be displayed.
        </Alert>
        <Button type="button" variant="outlined" onClick={reset}>
          Try again
        </Button>
      </Stack>
    </Container>
  );
}
