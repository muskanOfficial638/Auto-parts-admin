/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';


import React, { useEffect, useState } from 'react';
import { fetchKycAttachments,updateKycUser, imagePath} from '@/app/utils/api';
import { toast, ToastContainer } from 'react-toastify';
import { ChevronDownIcon } from 'lucide-react';
import Select from '../Select';

interface User {
    id: string;
    user_name?: string;
    company_name: string;
    email: string,
    kyc_status?: string;
    is_active: boolean;
    role: string;
    vat_number?: string;
}

const UpdateUserKyc = ({ isOpenModel, setIsOpenModel, userData, dataChanged }: any) => {
    const [formData, setFormData] = useState<User>(userData);
    const [error, setError] = useState('');
    const [status, setStatus] = useState(userData?.kyc_status ?? 'pending');
    const autoPartsUserData: any = localStorage.getItem("autoPartsUserData");
    const loggedInUser = JSON.parse(autoPartsUserData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (!value) {
            setError(`${name} is required`);
        }
        else {
            setError('');
        };
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => setIsOpenModel(false);

    const selectOptions = [
        { value: "approved", label: "Approved" },
        { value: "pending", label: "Pending" },
        { value: "rejected", label: "Rejected" }

    ];

    const handleSelectChange = (value: string) => {
        setStatus(value)
    };

    interface Attachment {
        id: string;
        status: 'pending' | 'approved' | 'rejected';
        user_id: string;
        attachment_name: string;
        created_at: string;
        updated_at: string;
    }
    const [attachments, setAttachments] = useState<Attachment[]>([
    ]);
    useEffect( () => {

         fetchKycAttachments(loggedInUser?.access_token,formData.id).then((data) => {
              if(data.length && data.length > 0){
                setAttachments(data);
       }
        });
  

    }, []);


    const handleStatusChange = (attachmentId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
        // Update the state
        setAttachments(prevAttachments =>
            prevAttachments.map(attachment =>
                attachment.id === attachmentId
                    ? {
                        ...attachment,
                        status: newStatus,
                        updated_at: new Date().toISOString() // Update timestamp
                    }
                    : attachment
            )
        );
    };
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (error) {
            return;
        }
        try {

            const filteredAttachments = attachments.map(
  ({ attachment_name, created_at, ...rest }) => rest
);

            var formUpdateData ={user_id:"",type:"",attachment:{}};
            formUpdateData.user_id = formData.id;
            formUpdateData.type = status;
            formUpdateData.attachment=filteredAttachments;
            console.log(formUpdateData)
            const response = await updateKycUser(loggedInUser?.access_token, formUpdateData)


            if (response?.status === 200) {
                toast("User KYC updated successfully");
                dataChanged(Math.random().toString())
                setTimeout(() => {
                    handleClose();

                }, 1000)
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
                            Update KYC Information
                        </h4>

                    </div>

                    <form className="flex flex-col" onSubmit={handleSubmit}>
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            {/* Personal Information */}
                            <div className="mt-7">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                                    <div className="flex flex-wrap items-center gap-8">
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                            Supplier Name <span className="text-error-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="user_name"
                                            readOnly
                                            value={(formData as any)['user_name']}
                                            onChange={handleChange}
                                            className="h-11 rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                                        />
                                    </div>


                                    <div className="space-y-3">
                                        <h4 className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                             Attachments
                                        </h4>
                                        {attachments.map((attachment) => (
                                            <div
                                                key={attachment.id}
                                                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                                            >
                                                {/* Left side - File info */}
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    {/* File icon with color coding */}
                                                    <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg ${attachment.attachment_name.endsWith('.pdf')
                                                        ? 'bg-red-50 text-red-600'
                                                        : attachment.attachment_name.endsWith('.png') || attachment.attachment_name.endsWith('.jpg') || attachment.attachment_name.endsWith('.jpeg')
                                                            ? 'bg-blue-50 text-blue-600'
                                                            : 'bg-gray-50 text-gray-600'
                                                        }`}>
                                                        {attachment.attachment_name.endsWith('.pdf') ? (
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>

                                                    {/* File details */}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {attachment.attachment_name}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">

                                                            {/* Upload date */}
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(attachment.created_at).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <a
                                                    href={imagePath+attachment.attachment_name}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center w-9 h-9 text-gray-500 hover:text-blue-600 bg-white border border-gray-300 hover:border-blue-400 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:shadow-sm group"
                                                    title="View Document"
                                                >
                                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </a>

                                                {/* Right side - Status dropdown */}
                                                <div className="flex-shrink-0 ml-4">
                                                    <select
                                                        onChange={(e) => handleStatusChange(
                                                            attachment.id,
                                                            e.target.value as 'pending' | 'approved' | 'rejected'
                                                        )}
                                                        defaultValue={attachment.status}
                                                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    >
                                                        <option value="pending" className="text-gray-700">Pending</option>
                                                        <option value="approved" className="text-green-700">Approved</option>
                                                        <option value="rejected" className="text-red-700">Rejected</option>
                                                    </select>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Empty state */}
                                        {attachments.length === 0 && (
                                            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                                                <p className="text-gray-500 font-medium">No attachments found</p>
                                               
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-8">
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                            KYC Status:
                                        </label>
                                        <div className="relative">
                                            <Select
                                                options={selectOptions}
                                                placeholder="Select status"
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
                        {error && (<span className="text-error-500 font-semibold">{error}</span>)}

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

                </div>
            </div>

        </div>
    );
};

export default UpdateUserKyc;
