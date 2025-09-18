import ChangePasswordPage from "@/components/auth/ChangePassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Change password Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Change password Page TailAdmin Dashboard Template",
  // other metadata
};

export default function ChangePassword() {
  return <ChangePasswordPage />;
}
