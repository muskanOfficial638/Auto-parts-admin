/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { toast, ToastContainer } from "react-toastify";
import { deleteUser } from "@/app/utils/api";

export default function DeleteUserModal({ isOpenDeleteModel, setIsOpenDeleteModal, userData }: any) {
    const autoPartsUserData: any = localStorage.getItem("autoPartsUserData")
    const loggedInUser = JSON.parse(autoPartsUserData);
    const [error, setError] = useState('')

    const handleClose = () => {
        setIsOpenDeleteModal(!isOpenDeleteModel);
    }

    async function handleDelete(e: React.FormEvent) {
        e.preventDefault();
        try {
            const response = await deleteUser(loggedInUser?.access_token, userData?.id)
            // console.log("Delete:", response);
            if (response?.status === 200) {
                toast("User Deleted successfully");
                setTimeout(() => {
                    setIsOpenDeleteModal(false);
                    window.location.reload();
                }, 2000)
            }
        } catch (err: any) {
            // Handle errors more gracefully
            if (err.response) {
                // Server responded with a status other than 2xx
                console.error("Server error:", err.response.data);
                setError(err.response.data.detail || "User not found");
            } else if (err.request) {
                // Request was made but no response received
                console.error("No response:", err.request);
                setError("No response from server");
            } else {
                // Something else happened
                console.error("Error:", err.message);
                setError("Unexpected error occurred");
            }
        }
    }

    return (
        <ComponentCard title="Delete user">
            <Modal
                isOpen={isOpenDeleteModel}
                onClose={() => { setIsOpenDeleteModal(false); handleClose() }}
                showCloseButton={false}
                className="max-w-[507px] p-6 lg:p-10"
            >
          <ToastContainer/>
                <form className="text-center" onSubmit={handleDelete}>
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
                        Delete user !!
                    </h4>
                    <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                        Are you sure?
                    </p>

                    <div className="flex items-center justify-center w-full gap-3 mt-8">
                        <Button size="sm" type="submit">
                            Yes
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setIsOpenDeleteModal(false); handleClose() }}>
                            No
                        </Button>
                    </div>
                </form>
            </Modal>
            {error && (<span className="text-error-500">{error}</span>)}
        </ComponentCard>
    );
}
