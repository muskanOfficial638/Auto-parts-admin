"use client";

import { useState } from "react";

// Order Status Type
type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<OrderStatus>("pending");

  // Submit Handler
  const handleSubmit = () => {
    console.log("Updated Status:", status);

    // TODO: Call API here
    // await updateOrderStatus(status);

    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      {/* Open Modal Button */}
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
      >
        Change Order Status
      </button>


      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          {/* Modal Box */}
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative animate-fadeIn">

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg"
            >
              ✕
            </button>


            {/* Header */}
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Change Order Status
            </h2>


            {/* Form */}
            <div className="space-y-4">

              {/* Order ID */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Order ID
                </label>

                <input
                  type="text"
                  value="OR-0001"
                  disabled
                  className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
                />
              </div>


              {/* Status Select */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Select Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as OrderStatus)
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setOpen(false)}
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

    </div>
  );
}
