
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AuthLogTable from "@/components/tables/AuthLogTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default async function AuthLogPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="View logs" />
      <div className="space-y-6">
        <ComponentCard title="Authentication logs">
          <AuthLogTable />
        </ComponentCard>
      </div>
    </div>
  );
}
