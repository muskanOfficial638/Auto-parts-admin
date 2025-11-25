/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Select from "../Select";
import { ChevronDownIcon } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { authApiPath } from "@/app/utils/api";
import axios from "axios";

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
  password?: any;
}

export default function AddUserModal({ isOpen, closeModal, role }: any) {
  const [formData, setFormData] = useState<User>();
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Active');
  const [emailError, setEmailError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const selectOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  // Email Validation
  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("Email is required");
    } else if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  //Password
  const validatePassword = (value: string) => {
    const errors: string[] = [];

    if (value.length < 6) errors.push("Minimum length 6 characters");
    if (!/[A-Z]/.test(value)) errors.push("Must contain at least one uppercase letter");
    if (!/[a-z]/.test(value)) errors.push("Must contain at least one lowercase letter");
    if (!/[0-9]/.test(value)) errors.push("Must contain at least one number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
      errors.push("Must contain at least one special character");
    setPasswordErrors(errors);
  };

  const handleSelectChange = (value: string) => {
    setStatus(value)
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!value) {
      setError(`${name} is required`);
    }
    else if (name === 'company_name' && value.length > 30 || (name === 'buyer_name' && value.length > 25 || name === 'supplier_name' && value.length > 25)) {
      setError(`${name === 'company_name' ? 'Company name can not be more than 30 characters long' : `${name} can not be more than 25 characters long`} `);
    }
    else {
      setError('');
    };
    validatePassword(value);
    validateEmail(value);

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSave(e: React.FormEvent) {
    console.log("formData",formData)
    e.preventDefault();

    try {
      if (!formData?.buyer_name || !formData.role || !formData.email || !formData.password) {
        if (!formData?.buyer_name) { setError('Name is required'); toast.error('Name is required'); }
        if (!formData?.buyer_name) { setError('Password is required'); toast.error('Password is required'); }
        return
      }
      // 🔒 Validate fields before submit
      validateEmail(formData.email);
      validatePassword(formData.password);

      if (!formData.email || emailError || passwordErrors.length > 0) {
        setError("Please fix the errors before submitting");
        return;
      }

      const response = await axios.post(`${authApiPath}/auth/register`, {
        formData,
        role: "buyer",
        is_active: true,

      });

      // console.log("RegisterData:", response.data);
      if (response?.data) {
        closeModal();
      }
    } catch (err: any) {
      // Handle errors more gracefully
      if (err.response) {
        // Server responded with a status other than 2xx
        console.error("Server error:", err.response.data);
        toast.error(err.response.data?.detail[0]?.msg || "Signup failed");
        setError(err.response.data?.detail[0]?.msg || "Signup failed");
      } else if (err.request) {
        // Request was made but no response received
        console.error("No response:", err.request);
        toast.error("No response from server");
        setError("No response from server");
      } else {
        // Something else happened
        console.error("Error:", err.message);
        toast.error("No response from server");
        setError("Unexpected error occurred");
      }
    }
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[584px] p-5 lg:p-10"
    >
       <ToastContainer />
      <form className="" onSubmit={handleSave}>
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Personal Information
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          {[
            { label: 'Name', name: role === 'buyer' ? 'buyer_name' : 'supplier_name' },
            { label: 'Company Name', name: 'company_name' },
            { label: 'Email Address', name: 'email' },
            { label: 'password', name: 'passowrd' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {label}<span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                name={name}
                onChange={handleChange}
                placeholder={label}
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
              />
            </div>
          ))}
          {role === 'buyer' ? (<div className="col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              VAT Number<span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              name="vat_number"
              onChange={handleChange}
              placeholder="VAT Number"
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
              onChange={handleChange}
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
            />
          </div>)}
          <div className="flex flex-row items-center gap-8">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Status:
            </label>
            <div className="relative w-full">
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
        {error && (<span className="text-error-500 font-semibold">{error}</span>)}
        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={closeModal}>
            Close
          </Button>
          <button
            type="submit"
            className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
