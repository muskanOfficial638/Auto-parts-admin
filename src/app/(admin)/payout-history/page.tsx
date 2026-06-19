"use client";
import { useState, useMemo, useEffect } from "react";
import {  ToastContainer } from "react-toastify";


import { getPayoutHistory } from "@/app/utils/api";
import {  PayoutRow } from "@/components/tables/PayoutTable";
import PayoutDetails from "@/components/auth/modal/PayoutDetails";
import { PayoutTable } from "@/components/tables/PayoutTable";
type PayoutsType = {
    unique_id: string,
    transfer_id: string,
    total_amount: string,
    payout_status: string,
    payout_updated_at: string,
    id: string,
    user_name: string,
    payout_amount: string,
    platform_fee: string,
}




const PayoutHistory = () => {

    const [data, setData] = useState<PayoutsType[]>([]);
    const [pageUpdateValue, setPageUpdateValue] = useState(false);

  
    const [showDetails, setShowDetails] = useState(false);
    const [showDetailsData, setShowDetailsData] = useState<string>("");




    useEffect(() => {
        const fetchData = async () => {
            const makeData = await getPayoutHistory();
            if(makeData.success) {
                setData(makeData.payouts);
            }
            
        };
        fetchData();

       setPageUpdateValue(false);
          
        
    }, [pageUpdateValue]);



    const pagesData = useMemo((): PayoutRow[] => {
        return data.map((order) => ({
            transfer_id: order.transfer_id,
            status: order.payout_status,
            created_at: order.payout_updated_at,
            amount: order.total_amount,
            id: order.id,
            user_name: order.user_name,
            unique_id: order.unique_id,
            payout_amount: order.payout_amount,
            platform_fee: order.platform_fee
        }));
    }, [data]);


    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <ToastContainer />
            <div className="border-b bg-card">
                <div className="container mx-auto px-6 py-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-foreground mb-2 dark:text-gray-400">
                        Payout History
                    </h1>

                </div>
            </div>
            <div className="container mx-auto px-6 py-8 overflow-x-auto">
                <PayoutTable
                    data={pagesData}
                    onView={(id) => {
                        setShowDetails(true);
                        setShowDetailsData(id);
                    }}
                />
            </div>
            {showDetails && (
                <PayoutDetails PayoutID={showDetailsData} onOpen={showDetails} setOpen={setShowDetails} />
            )}




        </div>
    );
};

export default PayoutHistory;


