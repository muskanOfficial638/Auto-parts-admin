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

import { adminApiPath, viewVehicleMake } from "@/app/utils/api";
// import Image from "next/image";
import { DataTable } from "simple-datatables";
import "simple-datatables/dist/style.css";
import { useModal } from "@/hooks/useModal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { Modal } from "../ui/modal";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";

interface VehicleMake {
    name: string;
    id: string;
}

export default function VehicleMakeTable() {
    const tableRef = useRef<HTMLTableElement | null>(null);
    const [vehicleMake, setVehicleMake] = useState<VehicleMake[]>();
    const [selectedMake, setSelectedMake] = useState(null as any);
    const { isOpen, openModal, closeModal } = useModal();
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // fetchVehicleMake("BMW").then((data) => {
        //     // console.log("Vehicle make", data)
        //     setVehicleMake(data); 
        // });
        viewVehicleMake().then((data) => {
            // console.log("Vehicle make list", data)
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

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();

        // Validate name
        if (!name.trim()) {
            setError("Name cannot be empty");
            return;
        }

        try {
            const response = await axios.post(`${adminApiPath}/vehicle/make`, {
                name,
            });

            console.log("Created:", response.data);
            toast("Vehicle Make added successfully");

            closeModal();
            setError("");  // Clear any previous errors
        } catch (err: any) {
            if (err.response) {
                console.error("Server error:", err.response.data);
                setError(err.response.data.message || "Unable to add make");
            } else if (err.request) {
                console.error("No response:", err.request);
                setError("No response from server");
            } else {
                console.error("Error:", err.message);
                setError("Unexpected error occurred");
            }
        }
    }

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();

        // Validate name
        if (!name.trim()) {
            setError("Name cannot be empty");
            return;
        }

        if (!selectedMake?.id) {
            setError("Invalid vehicle make selected.");
            return;
        }
        console.log("selected make", selectedMake)
        try {
            const response = await axios.put(`${adminApiPath}/vehicle/make/${selectedMake.id}`, {
                name,
            });

            console.log("Updated:", response.data);
            toast("Vehicle Make updated successfully");

            closeModal();
            setError("");  // Clear any previous errors
        } catch (err: any) {
            if (err.response) {
                console.error("Server error:", err.response.data);
                setError(err.response.data.message || "Unable to update make");
            } else if (err.request) {
                console.error("No response:", err.request);
                setError("No response from server");
            } else {
                console.error("Error:", err.message);
                setError("Unexpected error occurred");
            }
        }
    }

    if (!vehicleMake) return <div>Loading...</div>;

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <ToastContainer />
            {/* Add Button */}
            <div className="text-right ">
                <button onClick={openModal} className="text-gray-300 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 bg-brand-600 border p-2">
                    <div className="flex flex-row gap-2">Add Make <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none">
                        <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M17.091 3.532a2.25 2.25 0 0 0-3.182 0l-8.302 8.302c-.308.308-.52.7-.61 1.126l-.735 3.485a.75.75 0 0 0 .888.889l3.485-.735a2.25 2.25 0 0 0 1.127-.611l8.301-8.302a2.25 2.25 0 0 0 0-3.182zm-2.121 1.06a.75.75 0 0 1 1.06 0l.973.973a.75.75 0 0 1 0 1.06l-.899.899-2.033-2.033zm-1.96 1.96-6.342 6.342a.75.75 0 0 0-.203.376l-.498 2.358 2.358-.497a.75.75 0 0 0 .376-.204l6.343-6.342z"
                            clipRule="evenodd"
                        />
                    </svg></div>
                </button>
            </div>

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
                                    View
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
                            {vehicleMake?.map((make: any) => (
                                <TableRow key={make?.id}>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 overflow-hidden rounded-full">
                                                🚗
                                            </div>
                                            <div>
                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                    {make.name}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Link
                                            href={`/vehicle-model?makeName=${make.name}`}
                                            className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
                                        >
                                            View Models
                                        </Link>
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
                                            <button onClick={() => setSelectedMake(make)} className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none">
                                                    <path
                                                        fill="currentColor"
                                                        fillRule="evenodd"
                                                        d="M17.091 3.532a2.25 2.25 0 0 0-3.182 0l-8.302 8.302c-.308.308-.52.7-.61 1.126l-.735 3.485a.75.75 0 0 0 .888.889l3.485-.735a2.25 2.25 0 0 0 1.127-.611l8.301-8.302a2.25 2.25 0 0 0 0-3.182zm-2.121 1.06a.75.75 0 0 1 1.06 0l.973.973a.75.75 0 0 1 0 1.06l-.899.899-2.033-2.033zm-1.96 1.96-6.342 6.342a.75.75 0 0 0-.203.376l-.498 2.358 2.358-.497a.75.75 0 0 0 .376-.204l6.343-6.342z"
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
                    <Modal
                        isOpen={isOpen || selectedMake}
                        onClose={closeModal || setSelectedMake(null)}
                        className="max-w-[584px] p-5 lg:p-10"
                    >
                        <form className="" onSubmit={selectedMake ? handleUpdate : handleSave}>
                            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
                                {selectedMake ? "Update Vehicle Make" : "Add Vehicle Make"}
                            </h4>

                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                                <div className="col-span-1">
                                    <Label>Name</Label>
                                    <Input type="name" placeholder="Enter make"
                                        defaultValue={selectedMake ? selectedMake.name : name} // pre-fill with selected make if updating
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end w-full gap-3 mt-6">
                                <Button size="sm" variant="outline" onClick={closeModal} type={'button'}>
                                    Close
                                </Button>
                                <Button size="sm" type={'submit'}>
                                    {selectedMake ? "Update" : "Add"}
                                </Button>
                            </div>
                        </form>
                        {error && (<span className="text-error-500">{error}</span>)}
                    </Modal>
                </div>
            </div>
        </div>
    );
}