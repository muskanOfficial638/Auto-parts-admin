"use client";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect, useState } from "react";
// import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
// import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "@/components/ecommerce/StatisticsChart";
// import RecentOrders from "@/components/ecommerce/RecentOrders";
// import DemographicCard from "@/components/ecommerce/DemographicCard";
import { useRouter } from "next/navigation";
import { fetchAllPartRequests, fetchUsers } from "@/app/utils/api";
import { AutoPartsTable } from "../ecommerce/AutoPartsTable";
import { AutoPartRequest } from "@/types/auto-part";
// import { sampleAutoPartRequests } from "@/data/sample-data";

export default function EcommerceClient() {
    const router = useRouter();

    const [autoPartsUserData, setAutoPartsUserData] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // <-- Track load status
    const [supplierCount, setSuppliersCount] = useState(0);
    const [buyerCount, setBuyersCount] = useState(0);
    const [autoPartsData, setAutoPartsData] = useState<AutoPartRequest[]>();

    useEffect(() => {
        const data = localStorage.getItem("autoPartsUserData");
        setAutoPartsUserData(data);
        setIsLoading(false); // <-- Done loading
        const loggedInUser = JSON.parse(data || "{}");

        if (loggedInUser?.access_token) {
            fetchUsers("supplier", loggedInUser.access_token).then((data) => {
                setSuppliersCount(data?.length);
            });
            fetchUsers("buyer", loggedInUser.access_token).then((data) => {
                setBuyersCount(data?.length);
            });
        }
        fetchAllPartRequests().then((data) => {
            setAutoPartsData(data)
        });
    }, []);

    useEffect(() => {
        if (!isLoading && !autoPartsUserData) {
            router.push('/signin');
        }
    }, [autoPartsUserData, isLoading, router, supplierCount, buyerCount, autoPartsData]);

    if (isLoading || !autoPartsUserData || !autoPartsData) return null;

    return (
        <>

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6 xl:col-span-7">
                    <EcommerceMetrics supplierCount={supplierCount} buyerCount={buyerCount} />

                    {/* <MonthlySalesChart /> */}
                </div>

                {/* <div className="col-span-12 xl:col-span-5">
                <MonthlyTarget />
            </div> */}

                {/* <div className="col-span-12">
                <StatisticsChart />
            </div> */}

                {/* <div className="col-span-12 xl:col-span-5">
                <DemographicCard />
            </div> */}


                <div className="col-span-12">
                    <div className="mx-auto max-w-7xl space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight">Auto Parts Requests</h1>
                            <p className="text-lg text-muted-foreground">
                                Manage and track all vehicle part requests in one place
                            </p>
                        </div>

                        <AutoPartsTable data={autoPartsData} />
                    </div>
                </div>
                {/* <div className="col-span-12 xl:col-span-7">
                    <RecentOrders />
                </div> */}
            </div>
        </>

    );
}
