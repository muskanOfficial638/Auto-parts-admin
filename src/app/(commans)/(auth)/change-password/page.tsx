import ChangePasswordPage from "@/components/auth/ChangePassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change password",
  description: "This is Change Password page.",
  // other metadata
};

export default function ChangePassword() {
  return <ChangePasswordPage />;
}
