"use client";
import { useState,  useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";




import {  UpdatePlatformFee,getPlatformFee } from "@/app/utils/api";

const CmsPages = () => {
    const [platformFee, setPlatformFee] = useState<number>(0);

    useEffect(() => {     
        const fetchPlatformFee = async () => {
            try {
                const fee = await getPlatformFee();
                if(fee.success) {
                setPlatformFee(fee.platformFee?? 0);
                }
                
            } catch (error) {
                console.error("Failed to fetch platform fee:", error);
            }
        };

        fetchPlatformFee();
    }, []);

const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
           UpdatePlatformFee({platformFee}).then((response) => {


                if (response.data.success) {

                    toast.success("Platform fee updated successfully!");
                } else {
                    toast.error("Failed to update platform fee. Please try again.");
                }   
            }).catch((error) => {
                console.error("Failed to update platform fee:", error);
                toast.error("Failed to update platform fee. Please try again.");
            });
          
         
            
        }

        catch (error) {
            console.error("Failed to update platform fee:", error);
            toast.error("Failed to update platform fee. Please try again.");
        }
    };





    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <ToastContainer />
            <div className="border-b bg-card">
                <div className="container mx-auto px-6 py-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-foreground mb-2 dark:text-gray-400">
                        Settings
                    </h1>

                </div>
            </div>
            <div className="container mx-auto px-6 py-8 overflow-x-auto">
      <form className="" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between w-full gap-3 mt-6">
                 <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Commission Settings
        </h4>
          <button
            type="submit"
            className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600"
          >
            Save
          </button>
        </div>
   

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Platform Fee<span className="text-error-500">*</span>
              </label>
              <div className="relative">
              <input
                type="number"
                min={0}
                max={100}
                step={0.01}
                required
                value={platformFee}
                name="platform_fee"
                onChange={(e) => setPlatformFee(parseFloat(e.target.value))}
                placeholder="Platform Fee (%)"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
              />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">%</span>
  </div>
            </div>
        </div>
      
      </form>
            </div>
        </div>
    );
};

export default CmsPages;


