
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BuyerTable from "@/components/tables/BuyerTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default async function BuyerPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Manage users" />
      <div className="space-y-6">
        <ComponentCard title="Buyers">
          <BuyerTable />
        </ComponentCard>
      </div>
    </div>
  );
}
