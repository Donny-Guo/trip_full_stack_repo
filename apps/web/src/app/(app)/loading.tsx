import { CircularProgress, Container, Stack, Typography } from "@mui/material";

export default function ProtectedLoading(): React.ReactElement {
  return (
    <Container component="main" maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
        <Typography component="h1" variant="h4">
          Checking session
        </Typography>
        <CircularProgress aria-label="Checking session" size={28} />
      </Stack>
    </Container>
  );
}
