
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AuthLogTable from "@/components/tables/AuthLogTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Auth logs",
  description:
    "This is auth log page",
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
