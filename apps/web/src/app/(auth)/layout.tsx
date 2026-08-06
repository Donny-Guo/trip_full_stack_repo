import { Box, Container } from "@mui/material";
import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>): React.ReactElement {
  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ py: { xs: 4, sm: 8 } }}>{children}</Box>
    </Container>
  );
}
