
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Auth logs",
  description:
    "This is auth log page",
  // other metadata
};

export default async function OtherLogPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Other Admin Logs" />
      <div className="space-y-6">
        <ComponentCard title="Other logs">
            <div> Other Admin logs will take place here ......</div>
        </ComponentCard>
      </div>
    </div>
  );
}
