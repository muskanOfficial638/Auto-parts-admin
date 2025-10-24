/* eslint-disable @typescript-eslint/no-explicit-any */
import ResetPasswordPage from "@/components/auth/ResetPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Reset password Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js SignUp Page TailAdmin Dashboard Template",
  // other metadata
};
// interface ResetPasswordProps {
//   searchParams: { [key: string]: string | string[] | undefined };
// } 

export default function ResetPassword({ searchParams }: any) {
  const token = typeof searchParams.token === 'string' ? searchParams.token : undefined;
  return <ResetPasswordPage token={token || null} />;
}
