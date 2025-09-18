
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import VehicleMakeTable from "@/components/tables/VehicleMakeTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default async function VehiclePage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Vehicle" />
      <div className="space-y-6">
        <ComponentCard title="Vehicle make">
          <VehicleMakeTable />
        </ComponentCard>
      </div>
    </div>
  );
}
