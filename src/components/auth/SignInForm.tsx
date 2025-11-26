/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { authApiPath } from "@/app/utils/api";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
// import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
    setError("")
  };

  //Password
  const validatePassword = (value: string) => {
    const errors: string[] = [];
    if (!value) {
      setError("Password is required");
    }
    if (value.length < 6) errors.push("Minimum length 6 characters");
    if (!/[A-Z]/.test(value)) errors.push("Must contain at least one uppercase letter");
    if (!/[a-z]/.test(value)) errors.push("Must contain at least one lowercase letter");
    if (!/[0-9]/.test(value)) errors.push("Must contain at least one number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
      errors.push("Must contain at least one special character");
    setPasswordErrors(errors);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setError("");
    validatePassword(value);
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // 🔒 Validate fields before submit
    validateEmail(email);
    validatePassword(password);

    if (!email || emailError || passwordErrors.length > 0 || !password) {
      toast.error("Please fill in all required fields.")
      return;
    }

    try {
      const response = await axios.post(`${authApiPath}/auth/login`, {
        email,
        password,
      });

      // console.log("Logged in:", response.data);
      if (response?.data && response.data.access_token) {
        localStorage.setItem("autoPartsUserData", JSON.stringify(response.data));
        localStorage.setItem("loginTime", Date.now().toString());
        localStorage.setItem("lastActivity", Date.now().toString());
        router.push('/');
      }

    } catch (err: any) {
      // Handle errors more gracefully
      if (err.response) {
        // Server responded with a status other than 2xx
        console.error("Server error:", err.response.data);
        setError(err.response.data.detail || "Login failed")
        // toast.error(err.response.data.detail || "Login failed");
      } else if (err.request) {
        // Request was made but no response received
        console.error("No response:", err.request);
        toast.error("No response from server");
      } else {
        // Something else happened
        console.error("Error:", err.message);
        toast.error("Unexpected error occurred");
      }
    }
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <ToastContainer />
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        {/* <div
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Don&apos;t have an account? {""}
            <Link
              href="/signup"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Sign Up
            </Link>
          </p>
        </div> */}
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="info@gmail.com" type="email"
                    name="email"
                    onChange={handleEmailChange}
                  />
                </div>
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      name="password"
                      onChange={handlePasswordChange}
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
                  {
                   
                  error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  {/* <Link
                    href="/forgot-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link> */}
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
            {/* {error && (<span className="text-error-500">{error}</span>)} */}
            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
