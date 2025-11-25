import ForgotPasswordPage from "@/components/auth/ForgotPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Reset password Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Forgot-password page",
  // other metadata
};
 

export default function ForgotPassword() {
  return <ForgotPasswordPage/>;
}
