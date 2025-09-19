
import { fetchVehicleModelByMake } from "@/app/utils/api";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import VehicleModelTable from "@/components/tables/VehicleModelTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

export default async function VehicleModelPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const makeName = typeof searchParams.makeName === 'string' ? searchParams.makeName : undefined;

    const vehicleData = makeName ? await fetchVehicleModelByMake(makeName) : [];

    return (
        <div>
            <PageBreadcrumb pageTitle="Vehicle" />
            <div className="space-y-6">
                <ComponentCard title="Vehicle Model by make">
                    <VehicleModelTable vehicleMakeData={vehicleData} />
                </ComponentCard>
            </div>
        </div>
    );
}
