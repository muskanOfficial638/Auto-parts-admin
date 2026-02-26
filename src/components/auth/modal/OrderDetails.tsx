"use client";

import { getOrdersDetails, imagePath } from "@/app/utils/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

 interface SupplierData {
  name: string;
  email: string;
}
// Address
 interface Address {
  name: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
}

// Shipping Details
 interface ShippingDetails {
  tracking: string;
  tracking_url: string;
}
interface PaymentMeta {
  amount: string;
  paymentMethod: string;
    paymentStatus: string;
    paymentDate: string;
    transactionId: string;
    notes: string;

}
               
// Product
 interface ProductData {
  name: string;
  image: string[]; // multiple images
}


 interface OrderType {
  id: string;
  orderID: string;
  status: string; // better typed
  supplierData: SupplierData;
  address: Address;
  payment_meta: PaymentMeta;
  shipping_details: ShippingDetails;
  deliveryDate: string;
  productData: ProductData;
  created_at: string; // You can convert to Date if needed
}
export default function OrderDetails({ OrderID, onOpen, setOpen }: { OrderID: string, onOpen: boolean, setOpen: (value: boolean) => void }) {
   
    const [orderDetails, setOrderDetails] = useState<OrderType | null>(null);

    useEffect(() => {
 
    
        getOrdersDetails(OrderID).then((data) => {

        
            setOrderDetails(data);

        }).catch((error) => { 
            console.error("Error fetching order details:", error);
        
        });      
        
    }   , [OrderID]);
    
    return (
        <div className="">

            {(onOpen && orderDetails ) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-5xl mx-4 rounded-2xl shadow-2xl p-6 text-gray-800 relative animate-fadeIn">
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
                        >
                            ✕
                        </button>
                        <div className="flex items-center justify-between mb-6">

                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Order ID: {orderDetails?.orderID}
                                </h2>

                                <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-medium">
                                    Completed
                                </span>
                            </div>

                        </div>


                        {/* Supplier Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

                            <div className="flex-10">
                                <h3 className="font-semibold text-blue-700 mb-2">
                                Supplier: {orderDetails?.supplierData.name}
                                </h3>

                                <p className="text-sm text-gray-600 leading-relaxed">
                                    <span className="font-semibold text-gray-800">
                                        Shipping Note:
                                    </span>{" "}
                                    {orderDetails?.shipping_details.tracking}
                                </p>
                            </div>

                            <Link href={orderDetails?.shipping_details.tracking_url || "#"} className="bg-green-600 hover:bg-green-700 transition text-white px-5 py-2 rounded-lg shadow">
                               Track Now
                            </Link>
                        </div>


                        {/* Order Summary */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Order Summary
                        </h3>

                        <div className="bg-gray-50 border border-gray-200 rounded-xl grid md:grid-cols-3 gap-4 p-5">

                            {/* Product */}
                            <div className="md:col-span-2 flex gap-4">

                                {/* Image */}
                                <div className="w-24 h-20 bg-white border rounded-lg flex items-center justify-center shadow-sm">
                                   
                                    <Image
                                        src={imagePath+orderDetails?.productData.image[0] }
                                        alt="Disc Brake"
                                        width={150}
                                        height={150}
                                        className="w-full h-full object-contain p-1"
                                    /> 
                                </div>

                                {/* Details */}
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        {orderDetails?.productData.name}
                                    </h4>

                                    <p className="text-sm text-gray-500">
                                        Ordered Date: {orderDetails?.created_at}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Delivery: {orderDetails?.deliveryDate}
                                    </p>

                                    <p className="text-sm mt-2 text-gray-700">
                                        Price: <span className="font-semibold">R {orderDetails?.payment_meta.amount}</span>
                                    </p>
                                </div>
                            </div>


                            {/* Address */}
                            <div className="border-l border-gray-200 pl-4">

                                <h4 className="font-semibold mb-2 text-blue-600">
                                     Delivery Address
                                </h4>

                                <p className="text-sm text-gray-600">
{orderDetails?.address.name} {orderDetails?.address.address}  {orderDetails?.address.city}, {orderDetails?.address.province} ( {orderDetails?.address.postal_code} )  
                                </p>
                            </div>

                        </div>


                        {/* Total */}
                        <div className="flex justify-between items-center border-t border-gray-200 mt-6 pt-4">

                            <h3 className="text-lg font-semibold text-gray-900">
                                Total
                            </h3>

                            <h3 className="text-lg font-bold text-green-600">
                                R {orderDetails?.payment_meta.amount}
                            </h3>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
