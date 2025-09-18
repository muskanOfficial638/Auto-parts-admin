"use client";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect, useState } from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { useRouter } from "next/navigation";

export default function EcommerceClient() {
    const router = useRouter();

    const [autoPartsUserData, setAutoPartsUserData] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // <-- Track load status

    useEffect(() => {
        const data = localStorage.getItem("autoPartsUserData");
        setAutoPartsUserData(data);
        setIsLoading(false); // <-- Done loading
    }, []);

    useEffect(() => {
        if (!isLoading && !autoPartsUserData) {
            router.push('/signin');
        }
    }, [autoPartsUserData, isLoading, router]);

    if (isLoading || !autoPartsUserData) return null;

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-6 xl:col-span-7">
                <EcommerceMetrics />

                <MonthlySalesChart />
            </div>

            <div className="col-span-12 xl:col-span-5">
                <MonthlyTarget />
            </div>

            <div className="col-span-12">
                <StatisticsChart />
            </div>

            <div className="col-span-12 xl:col-span-5">
                <DemographicCard />
            </div>

            <div className="col-span-12 xl:col-span-7">
                <RecentOrders />
            </div>
        </div>
    );
}
