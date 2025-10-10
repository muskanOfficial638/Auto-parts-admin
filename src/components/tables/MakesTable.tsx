import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2 } from "lucide-react";

export type MakeRow = {
  id: string;
  name: string;
  modelCount: number;
};

interface MakesTableProps {
  data: MakeRow[];
  onEdit: (makeId: string) => void;
  onDelete: (makeId: string) => void;
}

export function MakesTable({ data, onEdit, onDelete }: MakesTableProps) {
  const columns: ColumnDef<MakeRow>[] = [
    {
      accessorKey: "name",
      header: "Make Name",
    },
    {
      accessorKey: "modelCount",
      header: "Models",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(row.original.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} searchPlaceholder="Search makes..." />;
}
