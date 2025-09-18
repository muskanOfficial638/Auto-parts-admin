import type { Metadata } from "next";
import EcommerceClient from "@/components/Dashboard/EcommerceClient";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {

  return (
    <EcommerceClient />
  );
}
