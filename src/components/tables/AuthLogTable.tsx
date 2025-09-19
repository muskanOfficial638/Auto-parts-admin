/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import { deleteAdminLogs, fetchAdminLogs } from "@/app/utils/api";
import { DataTable } from "simple-datatables";
import "simple-datatables/dist/style.css";
import { toast } from "react-toastify";

interface Order {
    id: string;
    user_id?: string;
    level: string;
    action: string,
    path: string;
    ip: string;
    user_agent: string;
    meta: {
        email: string;
    }
    created_at: string;
}

export default function AuthLogTable() {
    const adminRef = useRef<HTMLTableElement | null>(null);
    const [logData, setLogData] = useState<Order[]>();

    useEffect(() => {
        const autoPartsUserData = localStorage.getItem("autoPartsUserData");
        const loggedInUser = JSON.parse(autoPartsUserData || "{}");

        if (loggedInUser?.access_token) {
            fetchAdminLogs(loggedInUser.access_token).then((data) => {
                setLogData(data?.items);
            });
        }
    }, []);

    useEffect(() => {
        if (logData && adminRef.current) {
            // Delay to ensure DOM is updated
            setTimeout(() => {
                try {
                    new DataTable(adminRef.current!, {
                        paging: true,
                        perPage: 5,
                        perPageSelect: [5, 10, 20, 40],
                        firstLast: true,
                        nextPrev: true,
                        searchable: true,
                    });
                } catch (error) {
                    console.error("DataTable init failed:", error);
                }
            }, 0);
        }
    }, [logData]);

    if (!logData) return <div>Loading...</div>;

    async function handleDeleteLog(logId: string) {
        console.log("handle delete log", logId);
        const autoPartsUserData = localStorage.getItem("autoPartsUserData");
        const loggedInUser = JSON.parse(autoPartsUserData || "{}");
        try {
            const response = await deleteAdminLogs(loggedInUser?.access_token, logId)
            console.log("Delete log:", response);
            if (response?.status === 200) {
                toast("Log deleted successfully");
            }
        } catch (err: any) {
            // Handle errors more gracefully
            if (err.response) {
                // Server responded with a status other than 2xx
                console.error("Server error:", err.response.data);
                toast(err.response.data.detail || "log not found");
            } else if (err.request) {
                // Request was made but no response received
                console.error("No response:", err.request);
                toast("No response from server");
            } else {
                // Something else happened
                console.error("Error:", err.message);
                toast("Unexpected error occurred");
            }
        }
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-full">
                    <Table ref={adminRef}>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Action
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Email
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Path
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Level
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    IP
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
                            {logData?.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 overflow-hidden rounded-full">

                                                <svg className="fill-gray-500 dark:fill-gray-400" fill="" height="40px" width="40px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                                                    viewBox="0 0 496 496" xmlSpace="preserve">
                                                    <g>
                                                        <g>
                                                            <path d="M424,352c0-11.912-5.336-22.504-13.624-29.84c3.528-5.128,5.624-11.328,5.624-18.008v-4.28
			c0-3.432-0.552-6.816-1.64-10.072l-34.008-102.04C371.624,161.584,347.224,144,319.64,144h-26.48
			C309.504,130.792,320,110.608,320,88V62.032C320,27.824,292.168,0,257.968,0h-19.936C203.824,0,176,27.824,176,62.032V88
			c0,22.608,10.496,42.792,26.84,56h-26.48c-27.584,0-51.984,17.584-60.712,43.76L81.64,289.792
			c-1.088,3.256-1.64,6.648-1.64,10.072v4.28c0,6.688,2.088,12.888,5.624,18.016C77.336,329.496,72,340.088,72,352H40v128h128v16h72
			h8h80v-16h128V352H424z M408,352h-48c0-7.96,3.944-14.984,9.928-19.352c4.32,2.152,9.152,3.352,14.224,3.352
			c5.016,0,9.704-1.272,13.928-3.344C404.064,337.024,408,344.04,408,352z M399.184,294.864c0.544,1.616,0.816,3.304,0.816,5v4.28
			c0,3.808-1.408,7.264-3.656,10C392.432,312.872,388.336,312,384,312c-4.28,0-8.32,0.856-12.192,2.104
			c-0.968-1.208-1.776-2.568-2.376-4.064l-29.936-74.84l34.12-17.056L399.184,294.864z M357.84,321.984
			C349.432,329.32,344,339.992,344,352h-16V249.552l26.568,66.432C355.432,318.144,356.576,320.112,357.84,321.984z M192,62.024
			C192,36.648,212.648,16,238.032,16h19.936C283.352,16,304,36.648,304,62.032v3.096c-4.344-3.664-8.248-7.92-11.536-12.856
			C287.344,44.584,278.784,40,269.544,40h-43.096c-9.232,0-17.8,4.584-23.184,12.68c-3.128,4.696-6.968,8.856-11.264,12.464V62.024z
			 M192,88v-3.432c9.784-5.768,18.296-13.6,24.864-23.44C219,57.92,222.584,56,226.456,56h43.096c3.864,0,7.456,1.92,9.872,5.552
			c6.312,9.464,14.8,17.256,24.576,23.016V88c0,30.872-25.128,56-56,56S192,118.872,192,88z M278.032,160
			c-4.416,9.296-16.144,16-30.032,16s-25.616-6.704-30.032-16H248H278.032z M96,299.872c0-1.704,0.272-3.392,0.816-5.008
			l25.568-76.72l34.12,17.064l-29.936,74.832c-0.6,1.496-1.408,2.864-2.384,4.072C120.32,312.856,116.28,312,112,312
			c-4.336,0-8.432,0.872-12.344,2.152c-2.248-2.736-3.656-6.192-3.656-10V299.872z M97.92,332.656
			c4.232,2.072,8.912,3.344,13.928,3.344c5.072,0,9.904-1.2,14.216-3.352C132.056,337.016,136,344.04,136,352H88
			C88,344.04,91.936,337.024,97.92,332.656z M168,464H56v-96h16v16h16v-16h48v16h16v-16h16V464z M168,352h-16
			c0-12.016-5.432-22.68-13.848-30.016c1.264-1.872,2.408-3.84,3.28-6.008L168,249.544V352z M240,480h-56v-16h56V480z M312,480h-56
			v-16h56V480z M312,448h-56v-88h-16v88h-56v-80.808c18.232-3.72,32-19.88,32-39.192h64c0,19.312,13.768,35.472,32,39.192V448z
			 M184,350.528V328h16C200,338.416,193.288,347.216,184,350.528z M312,350.528c-9.296-3.312-16-12.112-16-22.528h16V350.528z
			 M312,200v112H184V200h-16v6.456l-5.536,13.832L127.488,202.8l3.328-9.984C137.368,173.184,155.672,160,176.36,160h24.608
			c4.456,18.232,23.848,32,47.032,32c23.184,0,42.568-13.768,47.032-32h24.608c20.688,0,38.992,13.184,45.536,32.824l3.328,9.984
			l-34.976,17.488L328,206.456V200H312z M440,464H328v-96h16v16h16v-16h48v16h16v-16h16V464z"/>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </div>
                                            <div>
                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    {order.action}
                                                </span>

                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {order.meta?.email}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex -space-x-2">
                                            {order.path}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Badge
                                            size="sm"
                                            color={
                                                order?.level !== "WARNING"
                                                    ? "success"
                                                    : "warning"

                                            }
                                        >
                                            {order?.level}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {order.ip}
                                    </TableCell>
                                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap">
                                        <div className="flex items-center w-full gap-2">
                                            {/* Delete Button */}
                                            <button onClick={() => handleDeleteLog(order?.id)} className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
                                                    <path
                                                        fill="currentColor"
                                                        fillRule="evenodd"
                                                        d="M6.541 3.792a2.25 2.25 0 0 1 2.25-2.25h2.417a2.25 2.25 0 0 1 2.25 2.25v.25h3.208a.75.75 0 0 1 0 1.5h-.29v10.666a2.25 2.25 0 0 1-2.25 2.25h-8.25a2.25 2.25 0 0 1-2.25-2.25V5.541h-.292a.75.75 0 1 1 0-1.5H6.54zm8.334 9.454V5.541h-9.75v10.667c0 .414.336.75.75.75h8.25a.75.75 0 0 0 .75-.75zM8.041 4.041h3.917v-.25a.75.75 0 0 0-.75-.75H8.791a.75.75 0 0 0-.75.75zM8.334 8a.75.75 0 0 1 .75.75v5a.75.75 0 1 1-1.5 0v-5a.75.75 0 0 1 .75-.75m4.083.75a.75.75 0 0 0-1.5 0v5a.75.75 0 1 0 1.5 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}