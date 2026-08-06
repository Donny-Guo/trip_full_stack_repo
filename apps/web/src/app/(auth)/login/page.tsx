import AuthForm from "@/features/auth/AuthForm";
import { sanitizeReturnPath } from "@/features/auth/return-path";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | Trip Agent",
};

interface LoginPageProps {
  readonly searchParams: Promise<{
    readonly returnTo?: string | string[];
  }>;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps): Promise<React.ReactElement> {
  const { returnTo: requestedReturnTo } = await searchParams;
  const returnTo = sanitizeReturnPath(requestedReturnTo);

  return <AuthForm mode="login" returnTo={returnTo} />;
}
