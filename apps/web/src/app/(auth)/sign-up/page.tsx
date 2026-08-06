import AuthForm from "@/features/auth/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account | Trip Agent",
};

export default function SignUpPage(): React.ReactElement {
  return <AuthForm mode="sign-up" returnTo="/dashboard" />;
}
