import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/Button";
import { EyeIcon } from "lucide-react";

export type PayoutRow = {
  status: string;
  created_at: string;
  amount: string;
  unique_id: string;
  transfer_id:string;
  id: string;
  user_name: string;
  payout_amount: string;
  platform_fee: string;
};

interface PayoutTableProps {
  data: PayoutRow[];

  onView: (pageId: string, pageSlug: string) => void;
}

export function PayoutTable({ data,onView }: PayoutTableProps) {
  const columns: ColumnDef<PayoutRow>[] = [
    

    {
      accessorKey: "unique_id",
      header: "Payout ID",
      cell: ({ row }) => {
        const uniqueId = row.original.unique_id as string;
        return (
          <div>
            #{uniqueId}
          </div>
        );
      }
    },
    {
      accessorKey: "user_name",
      header: "Supplier Name",
    },
    {
      accessorKey: "transfer_id",
      header: "Transfer ID",
    },
    
  
    {
      accessorKey: "created_at",
      header: "Date",
    },
    
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.original.amount as string;
        return (
          <div>
           R {amount}
          </div>
        );
      }
    },
       {
      accessorKey: "platform_fee",
      header: "Platform Fee",
      cell: ({ row }) => {
        const amount = row.original.platform_fee as string;
        return (
          <div>
           R {amount}
          </div>
        );
      }
    },
       {
      accessorKey: "payout_amount",
      header: "Payout Amount",
      cell: ({ row }) => {
        const amount = row.original.payout_amount as string;
        return (
          <div>
           R {amount}
          </div>
        );
      }
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
            onClick={() => onView(row.original.id,row.original.unique_id)}
          >
            <EyeIcon className="h-4 w-4 text-gray-500" />
          </Button> 
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} searchPlaceholder="Search" />;
}
