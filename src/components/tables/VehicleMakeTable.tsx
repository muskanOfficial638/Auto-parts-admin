"use client";
import { useEffect, useRef, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";

import { fetchVehicleMake } from "@/app/utils/api";
// import Image from "next/image";
import { DataTable } from "simple-datatables";
import "simple-datatables/dist/style.css";

interface VehicleMakeData {
    make_id: number;
    make: string;
    models: [{
        id: string;
        make_id: string;
        name: string;
        trims: [{
            id: string;
            trim: string;
            year_from: number;
            year_to: number;
        }]
    }]
}

export default function VehicleMakeTable() {
    const tableRef = useRef<HTMLTableElement | null>(null);
    const [vehicleMake, setVehicleMake] = useState<VehicleMakeData>();

    useEffect(() => {
        fetchVehicleMake("BMW").then((data) => {
            console.log("Vehicle make", data)
            setVehicleMake(data);
        });
    }, []);

    useEffect(() => {
        if (vehicleMake && tableRef.current) {
            // Delay to ensure DOM is updated
            setTimeout(() => {
                try {
                    new DataTable(tableRef.current!, {
                        paging: true,
                        perPage: 5,
                        perPageSelect: [5, 10, 20, 40],
                        firstLast: true,
                        nextPrev: true,
                        searchable: true
                    });
                } catch (error) {
                    console.error("DataTable init failed:", error);
                }
            }, 0);
        }
    }, [vehicleMake]);

    if (!vehicleMake) return <div>Loading...</div>;

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-full">
                    <Table ref={tableRef}>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Vehicle Make
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    View Model
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            <TableRow>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 overflow-hidden rounded-full">
                                            🚗
                                        </div>
                                        <div>
                                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                {vehicleMake.make}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
                                    >
                                        View Model
                                    </button>
                                </TableCell>

                                <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                                    <div className="flex items-center w-full gap-2">
                                        {/* Delete Button */}
                                        <button className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
                                                <path
                                                    fill="currentColor"
                                                    fillRule="evenodd"
                                                    d="M6.541 3.792a2.25 2.25 0 0 1 2.25-2.25h2.417a2.25 2.25 0 0 1 2.25 2.25v.25h3.208a.75.75 0 0 1 0 1.5h-.29v10.666a2.25 2.25 0 0 1-2.25 2.25h-8.25a2.25 2.25 0 0 1-2.25-2.25V5.541h-.292a.75.75 0 1 1 0-1.5H6.54zm8.334 9.454V5.541h-9.75v10.667c0 .414.336.75.75.75h8.25a.75.75 0 0 0 .75-.75zM8.041 4.041h3.917v-.25a.75.75 0 0 0-.75-.75H8.791a.75.75 0 0 0-.75.75zM8.334 8a.75.75 0 0 1 .75.75v5a.75.75 0 1 1-1.5 0v-5a.75.75 0 0 1 .75-.75m4.083.75a.75.75 0 0 0-1.5 0v5a.75.75 0 1 0 1.5 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>

                                        {/* Edit Button */}
                                        <button className="text-gray-300 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 bg-blue-600 border p-2">
                                            <div className="flex flex-row gap-2">Update Make <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none">
                                                <path
                                                    fill="currentColor"
                                                    fillRule="evenodd"
                                                    d="M17.091 3.532a2.25 2.25 0 0 0-3.182 0l-8.302 8.302c-.308.308-.52.7-.61 1.126l-.735 3.485a.75.75 0 0 0 .888.889l3.485-.735a2.25 2.25 0 0 0 1.127-.611l8.301-8.302a2.25 2.25 0 0 0 0-3.182zm-2.121 1.06a.75.75 0 0 1 1.06 0l.973.973a.75.75 0 0 1 0 1.06l-.899.899-2.033-2.033zm-1.96 1.96-6.342 6.342a.75.75 0 0 0-.203.376l-.498 2.358 2.358-.497a.75.75 0 0 0 .376-.204l6.343-6.342z"
                                                    clipRule="evenodd"
                                                />
                                            </svg></div>
                                        </button>
                                    </div>
                                </TableCell>

                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}