import type { Metadata } from "next";
import EcommerceClient from "@/components/Dashboard/EcommerceClient";

export const metadata: Metadata = {
  title:
    "Auto partXchange Admin",
  description: "This is Auto part exchange Dashboard",
};

export default function Ecommerce() {

  return (
    <EcommerceClient />
  );
}
