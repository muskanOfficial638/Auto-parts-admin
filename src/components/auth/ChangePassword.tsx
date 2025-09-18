/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authApiPath } from '@/app/utils/api';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export default function ChangePasswordPage() {
    const [error, setError] = useState("");
    const autoPartsUserData: any = localStorage.getItem("autoPartsUserData")
    const loggedInUser = JSON.parse(autoPartsUserData);

    const [formData, setFormData] = useState({
        email: loggedInUser?.user?.email,
        old_password: '',
        new_password: '',
        confirm_new_password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            const response = await axios.post(`${authApiPath}/auth/change-password`, {
                ...formData,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${loggedInUser?.access_token}`,
                },
            });
            // console.log("change:", response.data);

            if (response?.data && response.data.message) {
                toast(response.data.message)
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
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <ToastContainer />
            <div className="w-full max-w-md pt-10 mx-auto">
                <Link
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    href="/"
                >
                    <svg
                        className="stroke-current"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                    >
                        <path
                            d="M12.7083 5L7.5 10.2083L12.7083 15.4167"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Back to dashboard
                </Link>
            </div>

            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div className="mb-5 sm:mb-8">
                    <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                        Change Your Password?
                    </h1>

                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">


                        {/* Email */}
                        {/* <div className="col-span-full">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Email<span className="text-error-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    name="email"
                                    placeholder="Enter email address"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                                />
                            </div>
                        </div> */}

                        {/* Old Password */}
                        <div className="col-span-full">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Old Password<span className="text-error-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    name="old_password"
                                    placeholder="Enter old password"
                                    type="password"
                                    value={formData.old_password}
                                    onChange={handleChange}
                                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                                />
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="col-span-full">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                New password<span className="text-error-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    name="new_password"
                                    placeholder="Enter new password"
                                    type="password"
                                    value={formData.new_password}
                                    onChange={handleChange}
                                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                                />
                            </div>
                        </div>
                        {/* Confirm New Password */}
                        <div className="col-span-full">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Confirm New Password<span className="text-error-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    name="confirm_new_password"
                                    placeholder="Confirm new password"
                                    type="password"
                                    value={formData.confirm_new_password}
                                    onChange={handleChange}
                                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="col-span-full">
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition w-full px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
                {error && (<span className="text-error-500">{error}</span>)}
                <div className="mt-5">
                    <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                        Wait, I dont want to change my password...{' '}
                        <Link className="text-brand-500 hover:text-brand-600 dark:text-brand-400" href="/">
                            Click here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
