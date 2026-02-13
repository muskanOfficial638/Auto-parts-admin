"use client";
import { useState, useMemo, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

interface Orders {
    orderID: string,
    productTitle: string,
    status: string,
    created_at: string,
    quotedPrice: string,
    productImage: string[],
    id: string
}

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/Alert-dialog";


import { getAllOrders, updateOrderStatus } from "@/app/utils/api";
import { OrdersTable, OrderRow } from "@/components/tables/OrdersTable";
import OrderDetails from "@/components/auth/modal/OrderDetails";

const CmsPages = () => {

    const [data, setData] = useState<Orders[]>([]);


    const [pageUpdateValue, setPageUpdateValue] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showDetailsData, setShowDetailsData] = useState<string>("");
    const [changeStatusData, setChangeStatusData] = useState<string>("");
    const [status, setStatus] = useState<string>("pending");
    const [changeStatus, setChangeStatus] = useState(false);

    const handleSubmit = () => {

        const raw = localStorage.getItem("autoPartsUserData");
        const loggedInUser = JSON.parse(raw || "{}");

        updateOrderStatus(loggedInUser.access_token, { order_id: changeStatusData, status }).then((res) => {

            if (res.data.status === true) {
                toast.success("Order status updated successfully!");
                setChangeStatus(false);
                setPageUpdateValue(true);
            } else {
                toast.error("Failed to update order status.");
            }
          
          
        }).catch((err) => {
            console.error("API Error:", err);
        });

        
    };

    useEffect(() => {
        const raw = localStorage.getItem("autoPartsUserData");
        const loggedInUser = JSON.parse(raw || "{}");
        const fetchData = async () => {
            const makeData = await getAllOrders(loggedInUser.access_token);
            setData(makeData);
        };
        fetchData();
       setPageUpdateValue(false);
          
        
    }, [pageUpdateValue]);



    const pagesData = useMemo((): OrderRow[] => {
        return data.map((order) => ({
            title: order.productTitle,
            status: order.status,
            created_at: order.created_at,
            images: order.productImage[0],
            amount: order.quotedPrice,
            id: order.id,
            orderId: order.orderID

        }));
    }, [data]);


    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <ToastContainer />
            <div className="border-b bg-card">
                <div className="container mx-auto px-6 py-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-foreground mb-2 dark:text-gray-400">
                        Orders
                    </h1>

                </div>
            </div>
            <div className="container mx-auto px-6 py-8 overflow-x-auto">
                <OrdersTable
                    data={pagesData}
                    onEdit={(id) => {
                        setChangeStatus(true);
                        setChangeStatusData(id)
                    }}
                    onView={(id) => {

                        setShowDetails(true);
                        setShowDetailsData(id);
                    }}
                />
            </div>
            {showDetails && (
                <OrderDetails OrderID={showDetailsData} onOpen={showDetails} setOpen={setShowDetails} />
            )}
            {changeStatus && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative animate-fadeIn">
                        <button onClick={() => setChangeStatus(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg">✕</button>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Change Order Status
                        </h2>
                        <div className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Select Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_process">In Progress</option>
                                    <option value="in_transit">In Transit</option>
                                    <option value="completed">Completed</option>                                   
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setChangeStatus(false)}
                                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the{" "}

                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 text-white" onClick={() => { alert("wait") }}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default CmsPages;


