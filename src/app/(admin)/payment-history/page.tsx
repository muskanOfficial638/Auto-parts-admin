"use client";
import { useState, useMemo, useEffect } from "react";
import {  ToastContainer } from "react-toastify";


import { getPaymentHistory } from "@/app/utils/api";
import {  PaymentRow } from "@/components/tables/PaymentHistoryTable";

import { PaymentHistoryTable } from "@/components/tables/PaymentHistoryTable";
type PayoutsType = {
    unique_id: string,
    transactionId: string,
    amount: string,
    paymentStatus: string,
    order_date: string,
    order_id: string,
    buyer_name: string,
    paymentMethod: string
}




const PaymentHistory = () => {

    const [data, setData] = useState<PayoutsType[]>([]);
    const [pageUpdateValue, setPageUpdateValue] = useState(false);

  
    useEffect(() => {
        const fetchData = async () => {
            const makeData = await getPaymentHistory();
            if(makeData.success) {
                setData(makeData.orders);
            }
            
        };
        fetchData();

       setPageUpdateValue(false);
          
        
    }, [pageUpdateValue]);



    const pagesData = useMemo((): PaymentRow[] => {
        return data.map((order) => ({
            transactionId: order.transactionId,
            paymentStatus: order.paymentStatus,
            order_date: order.order_date,
            amount: order.amount,
            order_id: order.order_id,
            buyer_name: order.buyer_name,
            unique_id: order.unique_id,
            paymentMethod: order.paymentMethod
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
                <PaymentHistoryTable
                    data={pagesData}
          
                />
            </div>





        </div>
    );
};

export default PaymentHistory;


