/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, ChevronDownIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import Select from "../form/Select";
import axios from "axios";
import { useRouter } from "next/navigation";
import { authApiPath, sendVerification } from "@/app/utils/api";
import { toast, ToastContainer } from "react-toastify";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  const options = [
    { value: "buyer", label: "Buyer" },
    { value: "supplier", label: "Supplier" },
    { value: "admin", label: "Admin" },
  ];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [vat_number, setVATNumber] = useState("");
  const [company_name, setCompanyName] = useState("");
  const [role, setRole] = useState("");


  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await axios.post(`${authApiPath}/auth/register`, {
        email,
        password,
        name,
        vat_number: role === "buyer" ? vat_number : '',
        company_name,
        role,
        is_active: true,
        kyc_status: role === "supplier" ? 'pending' : ''
      });

      // console.log("RegisterData:", response.data);
      if (response?.data) {
        const verifyResponse = await sendVerification(response?.data?.data?.email)
        // console.log("verifyResponse",verifyResponse)
        toast(verifyResponse?.message)
        if (verifyResponse?.message) {
          router.push('/signin');
        }
      }
    } catch (err: any) {
      // Handle errors more gracefully
      if (err.response) {
        // Server responded with a status other than 2xx
        console.error("Server error:", err.response.data);
        setError(err.response.data.message || "Signup failed");
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

  const handleSelectChange = (value: string) => {
    console.log("value", value)
    setRole(value);
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <ToastContainer />
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <div
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Already have an account?
            <Link
              href="/signin"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter the following details for sign up!
            </p>
          </div>
          <div>

            <form onSubmit={handleRegister}>
              <div className="space-y-5">
                {/* <div className="grid grid-cols-1 gap-5 sm:grid-cols-2"> */}

                {/* <!-- Last Name --> */}
                <div className="sm:col-span-1">
                  <Label>
                    Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-1">
                  <Label>
                    Company Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="company_name"
                    name="company_name"
                    placeholder="Enter company name"
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Select Role</Label>
                  <div className="relative">
                    <Select
                      options={options}
                      placeholder="Select a role"
                      onChange={handleSelectChange}
                      className="dark:bg-dark-900"
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>
                {role === "buyer" && (<div className="sm:col-span-1">
                  <Label>
                    VAT Number<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="vat_number"
                    name="vat_number"
                    placeholder="Enter VAT number"
                    onChange={(e) => setVATNumber(e.target.value)}
                  />
                </div>)}

                {/* </div> */}
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {/* <!-- Password -->   Password must contain at least one uppercase letter,
                  Password must contain at least one lowercase letter
                  Password must contain at least one special character*/}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <!-- Checkbox --> */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                  </p>
                </div>
                {/* <!-- Button --> */}
                <div>
                  <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                    Sign Up
                  </button>
                </div>
              </div>
            </form>
            {error && (<span className="text-error-500">{error}</span>)}
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
