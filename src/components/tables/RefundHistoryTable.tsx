import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/DataTable";

export type RefundHistoryRow = {
    unique_id: string,
    refundId: string,
    amount: string,
    paymentStatus: string,
    order_date: string,
    order_id: string,
    buyer_name: string,
    paymentMethod: string
};

interface RefundHistoryTableProps {
  data: RefundHistoryRow[];


}

export function RefundHistoryTable({ data }: RefundHistoryTableProps) {
  const columns: ColumnDef<RefundHistoryRow>[] = [
    

    {
      accessorKey: "unique_id",
      header: "Order ID",
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
      accessorKey: "buyer_name",
      header: "Buyer Name",
    },
    {
      accessorKey: "refundId",
      header: "Refund ID",
    },
    
     
    {
      accessorKey: "order_date",
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
      accessorKey: "paymentStatus",
      header: "Status",
      cell: ({ row }) => {
            const status = row.original.paymentStatus as string;

  const colorStatus: Record<string, string> = {
    paid: "text-green-500",
    unpaid: "text-red-500",
    hold: "text-blue-500",
    failed: "text-gray-500",
    cancelled: "text-red-500",
    refunded: "text-purple-500",
  };
   const colorStatusName: Record<string, string> = {
    paid: "Paid",
    unpaid: "Unpaid",
    hold: "In Transit",
    failed: "Failed",
    cancelled:"Cancelled",
    refunded: "Refunded",
    
   
  };
          return (
            <div  className={colorStatus[status]} >
              {colorStatusName[status]}
            </div>
          );
        },
    },
  
  ];

  return <DataTable columns={columns} data={data} searchPlaceholder="Search" />;
}
