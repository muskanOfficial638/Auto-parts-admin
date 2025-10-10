/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authApiPath } from '@/app/utils/api';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage(token: any) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            const response = token?.token ? await axios.post(`${authApiPath}/auth/reset-password`, {
                token: token?.token,
                new_password: newPassword
            }) : await axios.post(`${authApiPath}/auth/forgot-password`, {
                email,
            });
            console.log("forgot/reset:", response.data);

            if (response?.data && response.data.message == "Password reset link sent to email") {
                toast("Password reset link sent to email")
            }
            if (token?.token && response?.data) {
                toast("Password updated successfully")
                setTimeout(() => {
                    router.push('/signin');
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
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <ToastContainer />
            <div className="w-full max-w-md pt-10 mx-auto">
                <Link
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    href="/signin"
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
                    Back to Sign In
                </Link>
            </div>

            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div className="mb-5 sm:mb-8">
                    <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                        {token?.token ? 'Type a new password' : 'Forgot Your Password?'}
                    </h1>
                    {!token?.token && (<p className="text-sm text-gray-500 dark:text-gray-400">
                        Enter the email address linked to your account, and we’ll send you a link to reset your password.
                    </p>)}

                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        {token?.token ? (<div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                New password<span className="text-error-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="new_password"
                                    name="new_password"
                                    type="password"
                                    placeholder="Enter new password"
                                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>) : (<div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Email<span className="text-error-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>)}

                        <div>
                            <button
                                type="submit"
                                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                            >
                                {token?.token ? 'Set New Password' : 'Send Reset Link'}
                            </button>
                        </div>
                    </div>
                </form>
                {error && (<span className="text-error-500">{error}</span>)}
                <div className="mt-5">
                    <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                        Wait, I remember my password...{' '}
                        <Link className="text-brand-500 hover:text-brand-600 dark:text-brand-400" href="/signin">
                            Click here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
