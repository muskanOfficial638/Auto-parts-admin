import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SupplierTable from "@/components/tables/SupplierTable";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Suppliers",
  description:
    "This is Table  page for Suppliers",
  // other metadata
};

export default async function SupplierPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Manage users" />
      <div className="space-y-6">
          <SupplierTable />
      </div>
    </div>
  );
}

