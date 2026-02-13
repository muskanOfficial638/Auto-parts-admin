import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/Button";
import { EyeIcon, Pencil } from "lucide-react";

import Image from "next/image";
import { imagePath } from "@/app/utils/api";

export type OrderRow = {
  title: string;
  images: string;
  status: string;
  created_at: string;
  amount: string;
  id: string;
  orderId:string;

  
};

interface OrdersTableProps {
  data: OrderRow[];
  onEdit: (pageId: string, pageSlug: string) => void;
  onView: (pageId: string, pageSlug: string) => void;
}

export function OrdersTable({ data, onEdit,onView }: OrdersTableProps) {
  const columns: ColumnDef<OrderRow>[] = [
    
    {
      accessorKey: "images",
      header: "Image",
     cell: ({ row }) => (
      <Image
        src={imagePath + row.getValue("images")}
        alt="Product"
        width={80}
        height={80}
        className="object-cover"
      />
    ),

    },
    {
      accessorKey: "orderId",
      header: "OrderId",
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    
     
    {
      accessorKey: "created_at",
      header: "Created At",
    },
    
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
            const status = row.original.status as string;

  const colorStatus: Record<string, string> = {
    pending: "text-yellow-500",
    in_process: "text-gray-500",
    in_transit: "text-blue-500",
    completed: "text-green-500",
    cancelled: "text-red-500",
  };
   const colorStatusName: Record<string, string> = {
    pending: "Active",
    in_process: "In Process",
    in_transit: "In Transit",
    completed: "Completed",
    cancelled:"Cancelled"
    
   
  };
          return (
            <div  className={colorStatus[status]} >
              {colorStatusName[status]}
            </div>
          );
        },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(row.original.id, row.original.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

           <Button
            variant="outline"
            size="sm"
            onClick={() => onView(row.original.id,row.original.orderId)}
          >
            <EyeIcon className="h-4 w-4 text-gray-500" />
          </Button> 
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} searchPlaceholder="Search makes..." />;
}
