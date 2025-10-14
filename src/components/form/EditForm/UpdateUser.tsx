/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { updateUser } from '@/app/utils/api';
import { toast, ToastContainer } from 'react-toastify';
import { ChevronDownIcon } from 'lucide-react';
import Select from '../Select';

interface User {
    id: string;
    supplier_name?: string;
    buyer_name?: string;
    company_name: string;
    email: string,
    kyc_status?: string;
    is_active: boolean;
    role: string;
    vat_number?: string;
}

const UpdateUserModal = ({ isOpenModel, setIsOpenModel, userData, onUserUpdate }: any) => {
    const [formData, setFormData] = useState<User>(userData);
    const [error, setError] = useState('');
    const [status, setStatus] = useState(userData?.is_active ? 'Active' : 'Inactive');
    const autoPartsUserData: any = localStorage.getItem("autoPartsUserData")
    const loggedInUser = JSON.parse(autoPartsUserData);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => setIsOpenModel(false);

    const selectOptions = [
        { value: "Active", label: "Active" },
        { value: "Incative", label: "Incative" },
    ];

    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
        setStatus(value)
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            formData.is_active = status === 'Active';
            const response = await updateUser(formData?.role, loggedInUser?.access_token, formData)
            // console.log("update:", response);

            if (response?.status === 200) {
                toast("User updated successfully");
                setTimeout(() => {
                    handleClose();
                    // Call the callback function from the parent
                    onUserUpdate();
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

    if (!isOpenModel) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-[99999]">
            <ToastContainer />
            <div className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"></div>
            <div className="relative w-full max-w-[700px] m-4 rounded-3xl bg-white dark:bg-gray-900">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute right-3 top-3 z-[999] flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                            fill="currentColor"
                        />
                    </svg>
                </button>

                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Edit Personal Information
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Update your details to keep your profile up-to-date.
                        </p>
                    </div>

                    <form className="flex flex-col" onSubmit={handleSubmit}>
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            {/* Personal Information */}
                            <div className="mt-7">
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    Personal Information
                                </h5>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    {[
                                        { label: 'Name', name: userData?.role === 'buyer' ? 'buyer_name' : 'supplier_name' },
                                        { label: 'Company Name', name: 'company_name' },
                                        { label: 'Email Address', name: 'email' },
                                        { label: 'Role', name: 'role' },
                                    ].map(({ label, name }) => (
                                        <div key={name}>
                                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                                {label}
                                            </label>
                                            <input
                                                type="text"
                                                name={name}
                                                value={(formData as any)[name]}
                                                onChange={handleChange}
                                                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                                            />
                                        </div>
                                    ))}

                                    {userData?.role === 'buyer' ? (<div className="col-span-2">
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                            VAT Number
                                        </label>
                                        <input
                                            type="text"
                                            name="vat_number"
                                            value={formData.vat_number}
                                            onChange={handleChange}
                                            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                                        />
                                    </div>
                                    ) : (<div className="col-span-2">
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                            KYC Status
                                        </label>
                                        <input
                                            type="text"
                                            name="kyc_status"
                                            value={formData.kyc_status}
                                            onChange={handleChange}
                                            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                                        />
                                    </div>)}
                                    <div className="flex flex-wrap items-center gap-8">
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                            User Status -
                                        </label>
                                        <div className="relative">
                                            <Select
                                                options={selectOptions}
                                                placeholder="Select model"
                                                onChange={handleSelectChange}
                                                className="dark:bg-dark-900"
                                                value={status}
                                            />
                                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                                <ChevronDownIcon />
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                    {error && (<span className="text-error-500">{error}</span>)}
                </div>
            </div>
        </div>
    );
};

export default UpdateUserModal;
