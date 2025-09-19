"use client";
import React, { useEffect, useRef,} from "react";
import { DataTable } from "simple-datatables";
import "simple-datatables/dist/style.css";
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
  const vehicleModeltableRef = useRef<HTMLTableElement | null>(null);

  // Initialize DataTable when vehicleMakeData is available
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

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold text-center mb-4">{vehicleMakeData.make} Vehicle Models</h2>
      <table ref={vehicleModeltableRef} className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border text-left">Model</th>
            <th className="px-4 py-2 border text-left">Trim</th>
            <th className="px-4 py-2 border text-left">Years</th>
          </tr>
        </thead>
        <tbody>
          {vehicleMakeData.models.map((model) => (
            model && model.trims.length === 0 ? (
              <tr key={model.id}>
                <td className="px-4 py-2 border">{model.name}</td>
                <td className="px-4 py-2 border" colSpan={3}>
                  No trims available
                </td>
              </tr>
            ) : (
              model.trims.map((trim) => (
                <tr key={trim.id}>
                  <td className="px-4 py-2 border">{model.name}</td>
                  <td className="px-4 py-2 border">{trim.trim}</td>
                  <td className="px-4 py-2 border">{trim.year_from} - {trim.year_to}</td>
                </tr>
              ))
            )
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleModelTable;
