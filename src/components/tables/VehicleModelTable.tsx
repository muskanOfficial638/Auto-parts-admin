/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState, } from "react";
import { DataTable } from "simple-datatables";
import "simple-datatables/dist/style.css";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import axios from "axios";
import { adminApiPath } from "@/app/utils/api";
import { toast, ToastContainer } from "react-toastify";
import { useModal } from "@/hooks/useModal";
// import { handleSaveOrUpdateTrim } from "@/app/utils/apiHelpers";

// Define the data types
interface Trim {
  id: string;
  trim: string;
  year_from: number;
  year_to: number;
}

interface Model {
  id: string;
  name: string;
  make_id: string;
  trims: Trim[];
}

interface VehicleMakeData {
  make: string;
  make_id: string;
  models: Model[];
}

interface VehicleTableProps {
  vehicleMakeData: VehicleMakeData;
}

const VehicleModelTable: React.FC<VehicleTableProps> = ({ vehicleMakeData }) => {
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [selectedModel, setSelectedVehicleModel] = useState<Model | null>();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const vehicleModeltableRef = useRef<HTMLTableElement | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    if (vehicleMakeData && vehicleModeltableRef.current) {
      // Delay to ensure DOM is updated
      setTimeout(() => {
        try {
          // Initialize the DataTable
          new DataTable(vehicleModeltableRef.current!, {
            paging: true,
            perPage: 5,
            perPageSelect: [5, 10, 20, 40],
            firstLast: true,
            nextPrev: true,
            searchable: true,
          });
        } catch (error) {
          console.error("DataTable init failed:", error);
        }
      }, 0);
    }
  }, [vehicleMakeData]);
  useEffect(() => {
    if (selectedModel) {
      setName(selectedModel.name);
    }
  }, [selectedModel]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    // Validate name
    if (!name.trim()) {
      setError("Model Name cannot be empty");
      return;
    }

    try {
      const response = await axios.post(`${adminApiPath}/vehicle/model`, {
        make_id: vehicleMakeData?.make_id,
        name,
      });
      console.log("Created Model:", response.data);
      toast("Vehicle Model added successfully");
      setError("");
      setTimeout(() => {
        closeModal();
      }, 2000)
    } catch (err: any) {
      if (err.response) {
        console.error("Server error:", err.response.data);
        setError(err.response.data.message || "Unable to add Model");
      } else if (err.request) {
        console.error("No response:", err.request);
        setError("No response from server");
      } else {
        console.error("Error:", err.message);
        setError("Unexpected error occurred");
      }
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    // Validate name
    if (!name.trim()) {
      setError("Model Name cannot be empty");
      return;
    }

    if (!selectedModel?.id) {
      setError("Invalid vehicle make selected.");
      return;
    }
    try {
      const response = await axios.put(`${adminApiPath}/vehicle/model/${selectedModel.id}`, {
        make_id: vehicleMakeData?.make_id,
        name,
      });

      console.log("Updated:", response.data);
      toast("Vehicle Make updated successfully");
      setTimeout(() => {
        setIsUpdateModalOpen(false);
      }, 2000)
      setError("");
    } catch (err: any) {
      if (err.response) {
        console.error("Server error:", err.response.data);
        setError(err.response.data.message || "Unable to update model");
      } else if (err.request) {
        console.error("No response:", err.request);
        setError("No response from server");
      } else {
        console.error("Error:", err.message);
        setError("Unexpected error occurred");
      }
    }
  }

  // const handleSaveTrim = (e: React.FormEvent) => {
  //   handleSaveOrUpdateTrim({
  //     e,
  //     trim,
  //     year_from,
  //     year_to,
  //     model_id: selectedModel?.id,
  //     isUpdate: false,
  //     endpoint: `${adminApiPath}/vehicle/trim`,
  //     onSuccess: () => {
  //       setError("");
  //       setTimeout(() => closeModal(), 2000);
  //     },
  //     onError: (msg) => setError(msg),
  //   });
  // };

  // const handleUpdateTrim = (e: React.FormEvent) => {
  //   handleSaveOrUpdateTrim({
  //     e,
  //     trim,
  //     year_from,
  //     year_to,
  //     model_id: selectedModel?.id,
  //     id: selectedModel?.id,
  //     isUpdate: true,
  //     endpoint: `${adminApiPath}/vehicle/model`,
  //     onSuccess: () => {
  //       setError("");
  //       setTimeout(() => setIsUpdateModalOpen(false), 2000);
  //     },
  //     onError: (msg) => setError(msg),
  //   });
  // };

  const handleOpenEditModel = (modelData: Model) => {
    setIsUpdateModalOpen(true);
    setSelectedVehicleModel(modelData)
  }

  const handleCloseEditModel = () => {
    setIsUpdateModalOpen(false);
    setSelectedVehicleModel(null)
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold text-center mb-4">{vehicleMakeData.make} Vehicle Models</h2>
      <ToastContainer />
      {/* Add Button */}
      <div className="text-right ">
        <button onClick={openModal} className="text-gray-300 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90 bg-brand-600 border p-2">
          <div className="flex flex-row gap-2">Add vehicle Model <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M17.091 3.532a2.25 2.25 0 0 0-3.182 0l-8.302 8.302c-.308.308-.52.7-.61 1.126l-.735 3.485a.75.75 0 0 0 .888.889l3.485-.735a2.25 2.25 0 0 0 1.127-.611l8.301-8.302a2.25 2.25 0 0 0 0-3.182zm-2.121 1.06a.75.75 0 0 1 1.06 0l.973.973a.75.75 0 0 1 0 1.06l-.899.899-2.033-2.033zm-1.96 1.96-6.342 6.342a.75.75 0 0 0-.203.376l-.498 2.358 2.358-.497a.75.75 0 0 0 .376-.204l6.343-6.342z"
              clipRule="evenodd"
            />
          </svg></div>
        </button>
      </div>
      <table ref={vehicleModeltableRef} className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border text-left">Model</th>
            <th className="px-4 py-2 border text-left">Trim</th>
            <th className="px-4 py-2 border text-left">Years</th>
            <th className="px-4 py-2 border text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {vehicleMakeData.models.map((model) =>
            model.trims.length === 0 ? (
              <tr key={model.id}>
                <td className="px-4 py-2 border">{model.name}</td>
                <td className="px-4 py-2 border">No trims found</td>
                <td className="px-4 py-2 border">—</td>
                <td className="px-4 py-2 border">
                  <button className="cursor-pointer" onClick={() => handleOpenEditModel(model)}>Edit Model</button>
                </td>
              </tr>
            ) : (
              model.trims.map((trim) => (
                <tr key={trim.id}>
                  <td className="px-4 py-2 border">{model.name}</td>
                  <td className="px-4 py-2 border">{trim.trim}</td>
                  <td className="px-4 py-2 border">
                    {trim.year_from} - {trim.year_to}
                  </td>
                  <td className="px-4 py-2 border"><button onClick={() => handleOpenEditModel(model)}>Edit Model</button></td>
                </tr>
              ))
            )
          )}
        </tbody>
      </table>

      {/* Add Model */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <ToastContainer />
        <form className="" onSubmit={handleSave}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Add Vehicle Make Model
          </h4>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1">
              <Label>Model Name</Label>
              <Input type="name" placeholder="Enter make"
                // value={selectedMake ? selectedMake.name : name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal} type={'button'}>
              Close
            </Button>
            <Button size="sm" type={'submit'}>
              Add
            </Button>
          </div>
        </form>
        {error && (<span className="text-error-500">{error}</span>)}
      </Modal>

      {/* Update Model */}
      {isUpdateModalOpen && selectedModel && (
        <Modal
          isOpen={!!selectedModel}
          onClose={handleCloseEditModel}
          className="max-w-[584px] p-5 lg:p-10"
        >
          <ToastContainer />
          <form className="" onSubmit={handleUpdate}>
            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
              Update Vehicle Model
            </h4>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <div className="col-span-1">
                <Label>Model Name</Label>
                <Input type="name" placeholder="Enter make"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end w-full gap-3 mt-6">
              <Button size="sm" variant="outline" type={'button'} onClick={handleCloseEditModel}>
                Close
              </Button>
              <Button size="sm" type={'submit'}>
                Update
              </Button>
            </div>
          </form>
          {error && (<span className="text-error-500">{error}</span>)}
        </Modal>
      )}
    </div>
  );

};

export default VehicleModelTable;
