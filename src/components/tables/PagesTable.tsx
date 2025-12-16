import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2 } from "lucide-react";

export type PageRow = {
  title: string;
  slug: string;
  status: string;
  created_at: string;
  updated_at: string;
  id: string;
};

interface PagesTableProps {
  data: PageRow[];
  onEdit: (pageId: string, pageSlug: string) => void;
  onDelete: (pageId: string, pageSlug: string) => void;
}

export function PagesTable({ data, onEdit, onDelete }: PagesTableProps) {
  const columns: ColumnDef<PageRow>[] = [
    {
      accessorKey: "title",
      header: "Page Title",
    },
    {
      accessorKey: "slug",
      header: "Slug",
    },
        {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "created_at",
      header: "Created At",
    },
     {
      accessorKey: "updated_at",
      header: "Updated At",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(row.original.id, row.original.slug)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(row.original.id,row.original.slug)}
          >
            <Trash2 className="h-4 w-4 text-error-500" />
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} searchPlaceholder="Search makes..." />;
}
