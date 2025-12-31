import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { PartRequestTable } from "@/components/tables/partRequestTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Part requests",
  description:
    "This is part request page",
  // other metadata
};

export default async function PartRequestPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Part requests" />
      <div className="space-y-6">
        <ComponentCard title="Part Request">
         <PartRequestTable />
        </ComponentCard>
      </div>
    </div>
  );
}
