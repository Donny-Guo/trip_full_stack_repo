import LogoutButton from "@/features/auth/LogoutButton";
import { Container, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Trip Agent",
};

export default function DashboardPage(): React.ReactElement {
  return (
    <Container component="main" maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Stack spacing={3} sx={{ alignItems: "flex-start" }}>
        <Typography component="h1" variant="h4">
          Dashboard
        </Typography>
        <LogoutButton />
      </Stack>
    </Container>
  );
}
