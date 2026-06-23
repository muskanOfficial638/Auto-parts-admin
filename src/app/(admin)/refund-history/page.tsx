"use client";
import { useState, useMemo, useEffect } from "react";
import {  ToastContainer } from "react-toastify";


import { getRefundHistory } from "@/app/utils/api";

import { RefundHistoryRow, RefundHistoryTable } from "@/components/tables/RefundHistoryTable";




const RefundHistory = () => {

    const [data, setData] = useState<RefundHistoryRow[]>([]);
    const [pageUpdateValue, setPageUpdateValue] = useState(false);

  
    useEffect(() => {
        const fetchData = async () => {
            const makeData = await getRefundHistory();
            if(makeData.success) {
                setData(makeData.refunded_orders);
            }
            
        };
        fetchData();

       setPageUpdateValue(false);
          
        
    }, [pageUpdateValue]);



    const pagesData = useMemo((): RefundHistoryRow[] => {
        return data.map((order) => ({
            refundId: order.refundId,
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
                        Refund History
                    </h1>

                </div>
            </div>
            <div className="container mx-auto px-6 py-8 overflow-x-auto">
                <RefundHistoryTable
                    data={pagesData}
          
                />
            </div>





        </div>
    );
};

export default RefundHistory;


