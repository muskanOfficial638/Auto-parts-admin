import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SupplierTableKyc from "@/components/tables/SupplierTableKyc";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Supplier KYC",
  description:
    "This is Table  page for Supplier KYC in Auto parts admin dashboard.",
  // other metadata
};

export default function BuyerPage() {

  return (
    <div>
      <PageBreadcrumb pageTitle="Manage users" />
      <div className="space-y-6 ">
          <SupplierTableKyc />
      </div>
    </div> 
  );
}
