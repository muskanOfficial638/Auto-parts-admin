"use client";

import React, { useEffect, useState } from "react";

import { BoxIconLine, GroupIcon } from "@/icons";
import { getDashBoard } from "@/app/utils/api";
import Link from "next/link";

export default function EcommerceClient() {
    const [isLoading, setIsLoading] = useState(true); // <-- Track load status
    const [Count, setCount] = useState({
        supplier_count: 0,
        buyer_count: 0,
        order_count: 0,
        part_request_count: 0,
        kyc_count: 0
    });

    useEffect(() => {

        setIsLoading(false);
        
     
            getDashBoard().then((data) => {
                setCount(data);
                console.log("Dashboard data:", data);
            });

        
    }, []);


    if (isLoading) return null;

    return (
        <>

            <div className="grid grid-cols-5 grid-rows-2 gap-4 md:gap-6">

                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    <Link href="/buyers">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
                        </div>

                        <div className="flex items-end justify-between mt-5">
                            
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Buyers
                                </span>
                                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                                    {Count.buyer_count}
                                </h4>
                           
                            {/* <Badge color="success">
                                        <ArrowUpIcon />
                                        0%
                                    </Badge> */}
                        </div>
                    </Link>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    <Link href="/suppliers">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                             <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
                        </div>
                        <div className="flex items-end justify-between mt-5">
                            
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Suppliers
                                </span>
                                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                                    {Count.supplier_count}
                                </h4>
                            


                        </div>
                    </Link>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    <Link href="/supplier-kyc">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
                        </div>
                        <div className="flex items-end justify-between mt-5">
                            
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    KYC Pending
                                </span>
                                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                                    {Count.kyc_count}
                                </h4>
                           


                        </div>
                    </Link>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    <Link href="/part-requests">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                            <BoxIconLine className="text-gray-800 dark:text-white/90" />
                        </div>
                        <div className="flex items-end justify-between mt-5">
                           
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Part Requests
                                </span>
                                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                                    {Count.part_request_count}
                                </h4>
                            


                        </div>
                    </Link>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                    <Link href="/orders">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                            <BoxIconLine className="text-gray-800 dark:text-white/90" />
                        </div>
                        <div className="flex items-end justify-between mt-5">
                            
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Orders
                                </span>
                                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                                    {Count.order_count}
                                </h4>
                            


                        </div>
                    </Link>
                </div>





                {/* <MonthlySalesChart /> */}
                {/* <div className="col-span-12 xl:col-span-5">
                <MonthlyTarget />
            </div> */}

                {/* <div className="col-span-12">
                <StatisticsChart />
            </div> */}

                {/* <div className="col-span-12 xl:col-span-5">
                <DemographicCard />
            </div> */}


                {/* <div className="col-span-12 xl:col-span-7">
                    <RecentOrders />
                </div> */}
            </div>
        </>

    );
}
