
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BuyerTable from "@/components/tables/BuyerTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Buyers",
  description:
    "This is Table  page for Buyers",
  // other metadata
};

export default async function BuyerPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Manage users" />
      <div className="space-y-6">
        <ComponentCard title="Buyers" isButtonVisible={true}>
          <BuyerTable />
        </ComponentCard>
      </div>
    </div>
  );
}
