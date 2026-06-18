"use client";

import {  getPayoutDetails } from "@/app/utils/api";

import { useEffect, useState } from "react";


        
interface PayoutResponse  {
  success: boolean;
  payoutId: string;
  uniqueId: number;
  payoutDate: string;
  supplierName: string;
  email: string;
  grossAmount: number;
  platformFee: number;
  netPayout: number;
  transactionId: string;
  payoutStatus: string;
  orders: {
    order_id: number;
    amount: number;
    quote_id: string;
    orderDate: string;
    title: string;
  }[];
};

export default function PayoutDetails({ PayoutID, onOpen, setOpen }: { PayoutID: string, onOpen: boolean, setOpen: (value: boolean) => void }) {
   
    const [orderDetails, setOrderDetails] = useState<PayoutResponse | null>(null);

    useEffect(() => {
 
    
        getPayoutDetails(PayoutID).then((data) => {
 console.log("Payout Details Data:", data); // Debug log to check the structure of the data
            setOrderDetails(data);

        }).catch((error) => { 
            console.error("Error fetching payout details:", error);
        
        });      
        
    }   , [PayoutID]);
    
    return (
        <div className="">

           {onOpen && orderDetails && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="[&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-[#FFFFFF00]
  [&::-webkit-scrollbar-thumb]:bg-[#C1C1C1]
  dark:[&::-webkit-scrollbar-track]:bg-[#FFFFFF00] 
  dark:[&::-webkit-scrollbar-thumb]:bg-[#C1C1C1] flxed top-5 max-h-[calc(100vh-50px)] overflow-y-auto bg-white w-full max-w-4xl mx-4 rounded-2xl shadow-2xl p-6 text-gray-800 relative">
      
      <button
        onClick={() => setOpen(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
      >
        ✕
      </button>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          Payout #{orderDetails.uniqueId}
        </h2>
        <p className="text-gray-500">
          Status: <span className={`font-semibold ${orderDetails.payoutStatus === 'completed' ? 'text-green-500' : orderDetails.payoutStatus === 'cancelled' ? 'text-red-500' : 'text-yellow-500'}`}>{orderDetails.payoutStatus.charAt(0).toUpperCase() + orderDetails.payoutStatus.slice(1).replace(/_/g, ' ')}</span>
        </p>
      </div>

      {/* Supplier Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-blue-700 mb-3">
          Supplier Information
        </h3>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
          <div>
            <span className="font-medium">Supplier Name:</span>{" "}
            {orderDetails.supplierName}
          </div>

          <div>
            <span className="font-medium">Email:</span>{" "}
            {orderDetails.email}
          </div>
         
            </div>
             <div>

          <div>
            <span className="font-medium">Payout Date:</span>{" "}
            {orderDetails.payoutDate}
          </div>

          <div>
            <span className="font-medium">Transaction ID:</span>{" "}
            {orderDetails.transactionId}
          </div>
          </div>
        </div>
      </div>

           {/* Orders */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Included Orders ({orderDetails.orders.length})
        </h3>

        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Order ID</th>

                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Order Date</th>
                <th className="text-right p-3">Amount</th>
              </tr>
            </thead>

            <tbody>
              {orderDetails.orders.map((order) => (
                <tr
                  key={order.order_id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">#{order.order_id}</td>

                  <td className="p-3">{order.title}</td>
                  <td className="p-3">{order.orderDate}</td>
                  <td className="p-3 text-right font-medium">
                    R {order.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amount Summary */}
      <div className="flex justify-end ">
        <div className="bg-gray-50 border rounded-xl p-4">
            <div className="flex gap-2 justify-between">       
         <p className="text-lg text-gray-500">Gross Amount</p>
          <p className="text-xl font-semibold text-gray-600">
            R {orderDetails.grossAmount}
          </p>
        </div>

        <div className="flex gap-2 justify-between my-2">
          <p className="text-lg  text-gray-500">Platform Fee</p>
          <p className="text-xl font-semibold text-red-600">
            R {orderDetails.platformFee}
          </p>
        </div>
   <div className="border border-dashed my-2" /> 
        <div className="flex gap-2 justify-between ">
          <p className="text-lg font-medium text-gray-500">Net Payout</p>
          <p className="text-xl font-semibold text-green-600 ">
            R {orderDetails.netPayout}
          </p>
        </div>
      </div>
      </div>

 

    </div>
  </div>
)}

        </div>
    );
}
