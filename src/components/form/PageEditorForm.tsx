/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { updatePage, imagePath, addNewPage, deleteImages } from '@/app/utils/api';
import { toast, ToastContainer } from 'react-toastify';
import { ChevronDownIcon, Trash2 } from 'lucide-react';
import FileInput from '@/components/form/input/FileInput';
import Select from './Select';
import { Button } from '../ui/Button';
import Image from 'next/image';
import { getPage } from "@/app/utils/api";



interface Page {
    id: string;
    title?: string;
    slug?: string;
    content: string;
    status?: string;
    thumbnail_url?: string;
    meta_title?: string;
    meta_description?: string;

}
const emptyPage: Page = {
  id: '',
  title: '',
  slug: '',
  content: '',
  status: '',
  thumbnail_url: '',
  meta_title: '',
  meta_description: '',
};
const PageEditorForm = ({ isOpenModel, setIsOpenModel, pageData, setPageUpdate }: any) => {
    const [formData, setFormData] = useState<Page>(emptyPage);
    const [removeImages, setRemoveImages] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('draft');
    const hasFetched = useRef(false);

    useEffect(() => {

        if (!pageData) return;
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchData = async () => {
            if (!pageData) return;
            const dataPage = await getPage(pageData);

            setStatus(dataPage.status);
            setFormData({
                id: dataPage.id,
                title: dataPage.title,
                slug: dataPage.slug,
                content: dataPage.content,
                status: dataPage.status,
                thumbnail_url: dataPage.thumbnail,
                meta_title: dataPage.meta_title,
                meta_description: dataPage.meta_description,
            });
        };
        fetchData();
    }, [pageData]);

    const removethumbnail = (thumbnail_url: string) => {
        setRemoveImages(prev => [...prev, thumbnail_url]);
        setFormData((prev) => ({ ...prev, thumbnail_url: '' }));
        

    };
    const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (!value) {
            setError(`${name} is required`);
        }
        else if (name === 'slug' && value.length < 3) {
            setError("Slug can not be less than 3 characters");
        }
        else {
            setError('');
        };

        if (name === 'slug') {
            const slugValue = value.replace(/\s+/g, '-').toLowerCase();
            setFormData((prev) => ({ ...prev, [name]: slugValue }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleClose = () => setIsOpenModel(false);

    const selectOptions = [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
    ];

const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
        ...prev!,
        thumbnail: file,
    }));
};

    const handleSelectChange = (value: string) => {

        setFormData((prev) => ({ ...prev, status: value }));
        setStatus(value)
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (
            !formData?.title ||
            !formData?.slug
        ) {
            setError('You can not leave the required fields empty');
            return;
        }
        if (error) {
            return;
        }
        try {
            if (pageData) {


                const response = await updatePage(pageData, formData)
                if (response?.status === 200) {
                    removeImages.forEach(async (thumbnail_url) => await deleteImages(thumbnail_url));
                    toast("Page updated successfully");
                    setPageUpdate(true);
                    setTimeout(() => {

                        handleClose();
                    }, 1000)
                }
            } else {
                const response = await addNewPage( formData)
                if (response?.status === 200) {
                    toast("Page added successfully");
                    setPageUpdate(true);
                    setTimeout(() => {
                        handleClose();
                    }, 1000)
                }
            }


        } catch (err: any) {
            // Handle errors more gracefully
            if (err.response) {
            
                
                toast.error(err.response.data.error);
            } else if (err.request) {
           
                console.error("No response:", err.request);
             
                toast.error('No response from server');
            } else {
                console.error("Error:", err.message);
                  toast.error('Unexpected error occurred');
                
            }
        }
    }

    if (!isOpenModel) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-[99999]">
            <ToastContainer />
            <div className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"></div>
            <div className="relative w-full  m-4 rounded-3xl bg-white dark:bg-gray-900">
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
                <div className="no-scrollbar relative w-full  overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {pageData ? "Edit Page" : "Add Page"}
                        </h4>
                    </div>

                    <form className="flex flex-col" onSubmit={handleSubmit}>
                        <div className="custom-scrollbar overflow-y-auto px-2 pb-3 flex gap-6 flex-col lg:flex-row lg:gap-8 lg:px-0 lg:pb-0  ">
                            {/* Personal Information */}
                            <div className="flex-3">

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                            Page Title<span className="text-error-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData?.title || ""}
                                            onChange={handleChange}
                                            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"

                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                            Slug<span className="text-error-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={formData?.slug || ""}
                                            onChange={handleChange}
                                            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"

                                        />
                                    </div>


                                </div>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-3">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                            Meta Title
                                        </label>
                                        <input
                                            type="text"
                                            name="meta_title"
                                            value={formData?.meta_title || ""}
                                            onChange={handleChange}
                                            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"

                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                            Meta Description
                                        </label>
                                        <input
                                            type="text"
                                            name="meta_description"
                                            value={formData?.meta_description || ""}
                                            onChange={handleChange}
                                            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"

                                        />
                                    </div>
                                </div>
                                <div className='mt-3'>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        Content
                                    </label>
                                    <textarea className=' w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800'
                                        rows={19}
                                        name="content"
                                        value={formData?.content || ""}
                                        onChange={handleChange}
                                    />


                                </div>
                            </div>
                            <div className="flex-1">
                                <div className='mt-3'>
                                    {formData?.thumbnail_url && (
                                        <div className='flex gap-2 items-center mb-2'>
                                            <Image src={imagePath + formData?.thumbnail_url || "/placeholder-image.png"} alt="Thumbnail" width={150} height={150} className="mb-2 rounded-lg border object-cover w-40 h-40" />
                                            <Button className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-1 text-sm bg-red-500 text-white shadow-theme-xs hover:bg-red-600" onClick={() => formData?.thumbnail_url && removethumbnail(formData.thumbnail_url)}><Trash2 size={16} /></Button>
                                        </div>
                                    )}
                                </div>
                                <div className='mt-3'>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        Thumbnail Image
                                    </label>
                                    <FileInput
                                        onChange={handleFile}
                                    />

                                </div>
                                <div className='mt-3'>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                        Status:
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
                            </div>

                        </div>
                        {error && (<span className="text-error-500 font-semibold">{error}</span>)}

                    </form>
                </div>
            </div>
        </div>
    );
};

export default PageEditorForm;
