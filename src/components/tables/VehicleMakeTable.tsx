/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHeader,
//     TableRow,
// } from "../ui/table";

import { adminApiPath, fetchVehicleModelByMake, viewVehicleMake } from "@/app/utils/api";
// import Image from "next/image";
// import { DataTable } from "simple-datatables";
import "simple-datatables/dist/style.css";
import { useModal } from "@/hooks/useModal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { Modal } from "../ui/modal";
// import axios from "axios";
import { ToastContainer } from "react-toastify";
// import Link from "next/link";
import DataTable from "react-data-table-component";
import DeleteVehicleMake from "../form/DeleteModal/DeleteVehicleMake";
import Select from "../form/Select";
import { ChevronDownIcon } from "@/icons";
import { handleSaveOrUpdateMake } from "@/app/utils/apiHelpers";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React from "react";

interface VehicleMake {
    make_name: string;
    make_id: string;
}

interface Trim {
    id: string;
    trim: string;
    year_from: number;
    year_to: number;
}

interface Model {
    id: string;
    name: string;
    make_id: string;
    trims: Trim[];
}

export default function VehicleMakeTable() {
    const tableRef = useRef<HTMLTableElement | null>(null);
    const [vehicleMake, setVehicleMake] = useState<VehicleMake[]>();
    const [selectedMake, setSelectedMake] = useState<VehicleMake | any>(null);
    const [selectedModel, setSelectedModel] = useState<VehicleMake | any>(null);
    const [VehicleModelsData, setVehicleModelsData] = useState<Model | any>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { isOpen, openModal, closeModal } = useModal();
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [selectMakeOptions, setSelectMakeOptions] = useState([]);
    const [selectModelOptions, setSelectModelOptions] = useState([]);
    const [isVehicleModelPopupOpen, setIsVehicleModelPopupOpen] = useState(false);
    const [isModelTrimPopupOpen, setIsModelTrimPopupOpen] = useState(false);

    const [yearFrom, setYearFrom] = React.useState(null);
    const [yearTo, setYearTo] = React.useState(null);

    const handleSelectMakeChange = async (option: string) => {
        const selectedId = option;
        setSelectedMake(selectedId);
        const vehicleMakeData = await viewVehicleMake();
        // Find the corresponding make name from your makes array
        const selectedMake = vehicleMakeData.find((make: VehicleMake) => make.make_id === selectedId);

        if (!selectedMake) {
            console.warn("Make not found for ID:", selectedId);
            return;
        }

        // Now use the name to fetch models
        const modelData = await fetchVehicleModelByMake(selectedMake.name);
        setVehicleModelsData(modelData);
        setSelectModelOptions(modelData?.models.map((item: VehicleMake) => ({
            value: item.make_id,
            label: item.make_name,
        })));
    };

    const handleSelectModelChange = async (option: string) => {
        setSelectedModel(option)
    };

    useEffect(() => {
        viewVehicleMake().then((data) => {
            // console.log("ddd",data)
            setVehicleMake(data);

            // Convert API data to select options
            const vehicleOptions = data.map((item: VehicleMake) => ({
                value: item.make_id,
                label: item.make_name,
            }));

            setSelectMakeOptions(vehicleOptions);
        });
    }, []);

    // useEffect(() => {
    //     if (vehicleMake && tableRef.current) {
    //         // Delay to ensure DOM is updated
    //         setTimeout(() => {
    //             try {
    //                 new DataTable(tableRef.current!, {
    //                     paging: true,
    //                     perPage: 5,
    //                     perPageSelect: [5, 10, 20, 40],
    //                     firstLast: true,
    //                     nextPrev: true,
    //                     searchable: true
    //                 });
    //             } catch (error) {
    //                 console.error("DataTable init failed:", error);
    //             }
    //         }, 0);
    //     }
    // }, [vehicleMake]);

    useEffect(() => {
        if (tableRef.current) {
            tableRef.current.addEventListener("click", (e) => {
                const target = e.target as HTMLElement;
                if (target.closest("[data-action='edit']")) {
                    console.log("Edit clicked!");
                }
            });
        }
    }, []);

    useEffect(() => {
        if (selectedMake) {
            setName(selectedMake.name);
        }
    }, [selectedMake]);

    const handleEditOpen = (row: VehicleMake) => {
        setSelectedMake(row);
        setName(row.make_name);
        setIsUpdateModalOpen(true);
    };

    const handleDeleteOpen = (row: VehicleMake) => {
        setSelectedMake(row);
        setIsDeleteModalOpen(true);
    };

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedMake(null);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedMake(null);
    };

    //Vehicle make table data
    const columns = [
        {
            name: 'Vehicle Make',
            selector: (row: any) => row.make_name,
            sortable: true,
        },
        // {
        //     name: 'View',
        //     cell: (row: any) => (
        //         <Link
        //             href={`/vehicle-model?makeName=${row.name}`}
        //             className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
        //         >
        //             View Models
        //         </Link>
        //     ),
        //     ignoreRowClick: true,
        //     allowoverflow: true,
        // },
        {
            name: 'Action',
            cell: (row: any) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEditOpen(row)}
                        className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none">
                            <path
                                fill="currentColor"
                                fillRule="evenodd"
                                d="M17.091 3.532a2.25 2.25 0 0 0-3.182 0l-8.302 8.302c-.308.308-.52.7-.61 1.126l-.735 3.485a.75.75 0 0 0 .888.889l3.485-.735a2.25 2.25 0 0 0 1.127-.611l8.301-8.302a2.25 2.25 0 0 0 0-3.182zm-2.121 1.06a.75.75 0 0 1 1.06 0l.973.973a.75.75 0 0 1 0 1.06l-.899.899-2.033-2.033zm-1.96 1.96-6.342 6.342a.75.75 0 0 0-.203.376l-.498 2.358 2.358-.497a.75.75 0 0 0 .376-.204l6.343-6.342z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={() => { setSelectedMake(row); setIsDeleteModalOpen(true) }}
                        className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
                    >
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
            ),
            ignoreRowClick: true,
            allowoverflow: true,
        },
    ];

    // async function handleSave(e: React.FormEvent) {
    //     e.preventDefault();

    //     // Validate name
    //     if (!name.trim()) {
    //         setError("Name cannot be empty");
    //         return;
    //     }

    //     try {
    //         const response = await axios.post(`${adminApiPath}/vehicle/make`, {
    //             name,
    //         });

    //         console.log("Created:", response.data);
    //         toast("Vehicle Make added successfully");

    //         closeModal();
    //         setError("");  // Clear any previous errors
    //     } catch (err: any) {
    //         if (err.response) {
    //             console.error("Server error:", err.response.data);
    //             setError(err.response.data.message || "Unable to add make");
    //         } else if (err.request) {
    //             console.error("No response:", err.request);
    //             setError("No response from server");
    //         } else {
    //             console.error("Error:", err.message);
    //             setError("Unexpected error occurred");
    //         }
    //     }
    // }

    // async function handleUpdate(e: React.FormEvent) {
    //     e.preventDefault();

    //     // Validate name
    //     if (!name.trim()) {
    //         setError("Name cannot be empty");
    //         return;
    //     }

    //     if (!selectedMake?.id) {
    //         setError("Invalid vehicle make selected.");
    //         return;
    //     }
    //     try {
    //         const response = await axios.put(`${adminApiPath}/vehicle/make/${selectedMake.id}`, {
    //             name,
    //         });

    //         console.log("Updated:", response.data);
    //         toast("Vehicle Make updated successfully");
    //         setError("");
    //         setTimeout(() => {
    //             setIsUpdateModalOpen(false);
    //         }, 2000)

    //     } catch (err: any) {
    //         if (err.response) {
    //             console.error("Server error:", err.response.data);
    //             setError(err.response.data.message || "Unable to update make");
    //         } else if (err.request) {
    //             console.error("No response:", err.request);
    //             setError("No response from server");
    //         } else {
    //             console.error("Error:", err.message);
    //             setError("Unexpected error occurred");
    //         }
    //     }
    // }

    const handleSave = (e: React.FormEvent) => {
        handleSaveOrUpdateMake({
            e,
            name,
            make_id: selectedMake?.id,
            isUpdate: false,
            endpoint: `${adminApiPath}/vehicle/make`,
            onSuccess: () => {
                setError("");
                setTimeout(() => closeModal(), 2000);
            },
            onError: (msg) => setError(msg),
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        handleSaveOrUpdateMake({
            e,
            name,
            make_id: selectedMake?.id,
            id: selectedModel?.id,
            isUpdate: true,
            endpoint: `${adminApiPath}/vehicle/model`,
            onSuccess: () => {
                setError("");
                setTimeout(() => setIsUpdateModalOpen(false), 2000);
            },
            onError: (msg) => setError(msg),
        });
    };

    const handleCloseModelPopup = () => {
        setIsVehicleModelPopupOpen(false)
    }

    const handleCloseTrimPopup = () => {
        setIsModelTrimPopupOpen(false)
    }

    if (!vehicleMake) return <div>Loading...</div>;

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <ToastContainer />
            {/* Add Button */}
            <div className="text-right">
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
                <button onClick={() => setIsVehicleModelPopupOpen(true)} className="text-gray-300 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 bg-brand-600 border p-2">
                    <div className="flex flex-row gap-2">Add Model <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none">
                        <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M17.091 3.532a2.25 2.25 0 0 0-3.182 0l-8.302 8.302c-.308.308-.52.7-.61 1.126l-.735 3.485a.75.75 0 0 0 .888.889l3.485-.735a2.25 2.25 0 0 0 1.127-.611l8.301-8.302a2.25 2.25 0 0 0 0-3.182zm-2.121 1.06a.75.75 0 0 1 1.06 0l.973.973a.75.75 0 0 1 0 1.06l-.899.899-2.033-2.033zm-1.96 1.96-6.342 6.342a.75.75 0 0 0-.203.376l-.498 2.358 2.358-.497a.75.75 0 0 0 .376-.204l6.343-6.342z"
                            clipRule="evenodd"
                        />
                    </svg></div>
                </button>
                <button onClick={() => setIsModelTrimPopupOpen(true)} className="text-gray-300 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 bg-brand-600 border p-2">
                    <div className="flex flex-row gap-2">Add Trim <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none">
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
                    <DataTable
                        columns={columns}
                        data={vehicleMake || []}
                        defaultSortFieldId="name"
                        sortIcon={'^'}
                        defaultSortAsc={true}
                        pagination
                        highlightOnHover
                        dense
                        responsive
                    />

                    {/* Add/Update Make */}
                    <Modal
                        isOpen={isOpen || selectedMake}
                        onClose={closeModal}
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
                                        // value={selectedMake ? selectedMake.name : name}
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

                    {/* Update Make */}
                    {isUpdateModalOpen && (
                        <Modal
                            isOpen={isUpdateModalOpen}
                            onClose={closeUpdateModal}
                            className="max-w-[584px] p-5 lg:p-10"
                        >
                            <ToastContainer />
                            <form className="" onSubmit={handleUpdate}>
                                <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
                                    Update Vehicle Make
                                </h4>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                                    <div className="col-span-1">
                                        <Label>Name</Label>
                                        <Input type="name" placeholder="Enter make"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end w-full gap-3 mt-6">
                                    <Button size="sm" variant="outline" onClick={closeUpdateModal} type={'button'}>
                                        Close
                                    </Button>
                                    <Button size="sm" type={'submit'}>
                                        Update
                                    </Button>
                                </div>
                            </form>
                            {error && (<span className="text-error-500">{error}</span>)}
                        </Modal>
                    )}

                    {/* Delete Make */}
                    {selectedMake && isDeleteModalOpen && (
                        <DeleteVehicleMake isOpenDeleteModel={handleDeleteOpen}
                            setIsOpenDeleteModal={() => {
                                closeDeleteModal()
                            }} makeData={selectedMake} />
                    )}

                    {/* Add Model */}
                    <Modal
                        isOpen={isVehicleModelPopupOpen}
                        onClose={handleCloseModelPopup}
                        className="max-w-[584px] p-5 lg:p-10"
                    >
                        <ToastContainer />
                        <form className="" onSubmit={handleSave}>
                            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
                                Add Vehicle Make Model
                            </h4>
                            <div>
                                <Label>Select Vehicle Make</Label>
                                <div className="relative">
                                    <Select
                                        options={selectMakeOptions}
                                        placeholder="Select make"
                                        onChange={handleSelectMakeChange}
                                        className="dark:bg-dark-900"
                                    />
                                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                        <ChevronDownIcon />
                                    </span>
                                </div>
                            </div>

                            <div className="col-span-1">
                                <Label>Model Name</Label>
                                <Input type="name" placeholder="Enter make"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center justify-end w-full gap-3 mt-6">
                                <Button size="sm" variant="outline" onClick={handleCloseModelPopup} type={'button'}>
                                    Close
                                </Button>
                                <Button size="sm" type={'submit'}>
                                    Add Model
                                </Button>
                            </div>
                        </form>
                        {error && (<span className="text-error-500">{error}</span>)}
                    </Modal>

                    {/* Add Trim */}
                    <Modal
                        isOpen={isModelTrimPopupOpen}
                        onClose={handleCloseTrimPopup}
                        className="max-w-[584px] p-5 lg:p-10"
                    >
                        <ToastContainer />
                        <form className="" onSubmit={handleSave}>
                            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
                                Add Model Trim
                            </h4>
                            <div>
                                <Label>Select Make</Label>
                                <div className="relative">
                                    <Select
                                        options={selectMakeOptions}
                                        placeholder="Select make"
                                        onChange={handleSelectMakeChange}
                                        className="dark:bg-dark-900"
                                    />
                                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                        <ChevronDownIcon />
                                    </span>
                                </div>
                            </div>
                            {VehicleModelsData && (
                                <div>
                                    <Label>Select Vehicle Model</Label>
                                    <div className="relative">
                                        <Select
                                            options={selectModelOptions}
                                            placeholder="Select model"
                                            onChange={handleSelectModelChange}
                                            className="dark:bg-dark-900"
                                        />
                                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                            <ChevronDownIcon />
                                        </span>
                                    </div>
                                </div>
                            )}


                            <div className="col-span-1 mb-4">
                                <Label>Trim name</Label>
                                <Input type="name" placeholder="Enter Trim"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <div className="flex space-x-4"> {/* Tailwind for layout */}
                                    <DatePicker
                                        label="Year From"
                                        views={['year']}
                                        value={yearFrom}
                                        onChange={(newValue:any) => setYearFrom(newValue)}
                                    />
                                    <DatePicker
                                        label="Year To"
                                        views={['year']}
                                        value={yearTo}
                                        onChange={(newValue:any) => setYearTo(newValue)}
                                    />
                                </div>
                            </LocalizationProvider>

                            <div className="flex items-center justify-end w-full gap-3 mt-6">
                                <Button size="sm" variant="outline" onClick={handleCloseTrimPopup} type={'button'}>
                                    Close
                                </Button>
                                <Button size="sm" type={'submit'}>
                                    Add Trim
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