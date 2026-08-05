import { Container, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Container component="main" maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography component="h1" variant="h3" color="primary.main">
        Trip Agent
      </Typography>
    </Container>
  );
}
