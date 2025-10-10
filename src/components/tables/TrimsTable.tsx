import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2 } from "lucide-react";

export type TrimRow = {
  id: string;
  trim: string;
  modelName: string;
  makeName: string;
  makeId: string;
  modelId: string;
  year_from: number;
  year_to: number;
};

interface TrimsTableProps {
  data: TrimRow[];
  onEdit: (trimId: string, makeId: string, modelId: string) => void;
  onDelete: (trimId: string, makeId: string, modelId: string) => void;
}

export function TrimsTable({ data, onEdit, onDelete }: TrimsTableProps) {
  const columns: ColumnDef<TrimRow>[] = [
    {
      accessorKey: "trim",
      header: "Trim Name",
    },
    {
      accessorKey: "modelName",
      header: "Model",
    },
    {
      accessorKey: "makeName",
      header: "Make",
    },
    {
      accessorKey: "year_from",
      header: "Year From",
    },
    {
      accessorKey: "year_to",
      header: "Year To",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onEdit(
                row.original.id,
                row.original.makeId,
                row.original.modelId
              )
            }
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onDelete(
                row.original.id,
                row.original.makeId,
                row.original.modelId
              )
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} searchPlaceholder="Search trims..." />;
}
