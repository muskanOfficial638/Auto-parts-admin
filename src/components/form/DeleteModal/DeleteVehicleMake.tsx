/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { toast, ToastContainer } from "react-toastify";
import { deleteVehicle } from "@/app/utils/api";

export default function DeleteVehicleMake({ isOpenDeleteModel, setIsOpenDeleteModal, makeData }: any) {
    const [error, setError] = useState('')
    const autoPartsUserData: any = localStorage.getItem("autoPartsUserData");
    const loggedInUser = JSON.parse(autoPartsUserData);

    const handleClose = () => {
        setIsOpenDeleteModal(!isOpenDeleteModel);
    }

    async function handleDeleteMake(e: React.FormEvent) {
        e.preventDefault();
        try {
            const response = await deleteVehicle('make',makeData?.id, loggedInUser?.access_token)
            // console.log("make delete res", response);
            if (response?.status === 200) {
                console.log("hello 200")
                toast.success("Make Deleted successfully");
            }
            setTimeout(() => {
                handleClose();
            }, 3000)
        } catch (err: any) {
            if (err.response) {
                console.error("Server error:", err.response.data);
                setError(err.response.data.detail || "Vehicle make not found");
            } else if (err.request) {
                console.error("No response:", err.request);
                setError("No response from server");
            } else {
                console.error("Error:", err.message);
                setError("Unexpected error occurred");
            }
        }
    }

    return (
        <ComponentCard title="Delete user">
            <Modal
                isOpen={isOpenDeleteModel}
                onClose={() => handleClose()}
                showCloseButton={false}
                className="max-w-[507px] p-6 lg:p-10"
            >
                <ToastContainer />
                <form className="text-center" onSubmit={handleDeleteMake}>
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
                        Delete Vehicle Make !!
                    </h4>
                    <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                        Are you sure?
                    </p>

                    <div className="flex items-center justify-center w-full gap-3 mt-8">
                        <Button size="sm" type="submit">
                            Yes
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleClose()}>
                            No
                        </Button>
                    </div>
                </form>
            </Modal>
            {error && (<span className="text-error-500">{error}</span>)}
        </ComponentCard>
    );
}
