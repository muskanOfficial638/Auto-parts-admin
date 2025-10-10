import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2 } from "lucide-react";

export type ModelRow = {
  id: string;
  name: string;
  makeName: string;
  makeId: string;
  trimCount: number;
};

interface ModelsTableProps {
  data: ModelRow[];
  onEdit: (modelId: string, makeId: string) => void;
  onDelete: (modelId: string, makeId: string) => void;
}

export function ModelsTable({ data, onEdit, onDelete }: ModelsTableProps) {
  const columns: ColumnDef<ModelRow>[] = [
    {
      accessorKey: "name",
      header: "Model Name",
    },
    {
      accessorKey: "makeName",
      header: "Make",
    },
    {
      accessorKey: "trimCount",
      header: "Trims",
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
              onEdit(row.original.id, row.original.makeId)
            }
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onDelete(row.original.id, row.original.makeId)
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} searchPlaceholder="Search models..." />;
}
