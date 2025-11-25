"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import { fetchUsers } from "@/app/utils/api";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { matchSorter } from "match-sorter";
import UpdateUserModal from "../form/EditForm/UpdateUser";
import DeleteUserModal from "../form/DeleteModal/DeleteUser";

interface Buyer {
  id: number;
  buyer_name: string;
  company_name: string;
  email: string,
  vat_number: string;
  is_active?: boolean;
  role?: string;
}

export default function BuyerTable() {
  const [buyerData, setBuyersData] = useState<Buyer[]>();
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const autoPartsUserData = localStorage.getItem("autoPartsUserData");
      const loggedInUser = JSON.parse(autoPartsUserData || "{}");

      if (loggedInUser?.access_token) {
        fetchUsers("buyer", loggedInUser.access_token).then((data) => {
          setBuyersData(data);
        });
      }
    }
  }, []);

  useEffect(() => {
  }, [buyerData]);

  // Columns for TanStack Table
  const columns = useMemo<ColumnDef<Buyer>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "buyer_name",
      },
      {
        header: "Company Name",
        accessorKey: "company_name",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Status",
        accessorKey: "is_active",
        cell: ({ row }) => {
          const isActive = row.original.is_active;
          return (
            <Badge size="sm" color={isActive ? "success" : "error"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
      {
        header: "VAT Number",
        accessorKey: "vat_number",

      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
          const buyer = row.original;
          return (
            <div className="flex items-center w-full gap-2">
              {/* Delete Button */}
              <button
                onClick={() => handleDeleteModalOpen(buyer)}
                className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none">
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M6.541 3.792a2.25 2.25 0 0 1 2.25-2.25h2.417a2.25 2.25 0 0 1 2.25 2.25v.25h3.208a.75.75 0 0 1 0 1.5h-.29v10.666a2.25 2.25 0 0 1-2.25 2.25h-8.25a2.25 2.25 0 0 1-2.25-2.25V5.541h-.292a.75.75 0 1 1 0-1.5H6.54zm8.334 9.454V5.541h-9.75v10.667c0 .414.336.75.75.75h8.25a.75.75 0 0 0 .75-.75zM8.041 4.041h3.917v-.25a.75.75 0 0 0-.75-.75H8.791a.75.75 0 0 0-.75.75zM8.334 8a.75.75 0 0 1 .75.75v5a.75.75 0 1 1-1.5 0v-5a.75.75 0 0 1 .75-.75m4.083.75a.75.75 0 0 0-1.5 0v5a.75.75 0 1 0 1.5 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Edit Button */}
              <button
                onClick={() => handleUpdateModalOpen(buyer)}
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none">
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M17.091 3.532a2.25 2.25 0 0 0-3.182 0l-8.302 8.302c-.308.308-.52.7-.61 1.126l-.735 3.485a.75.75 0 0 0 .888.889l3.485-.735a2.25 2.25 0 0 0 1.127-.611l8.301-8.302a2.25 2.25 0 0 0 0-3.182zm-2.121 1.06a.75.75 0 0 1 1.06 0l.973.973a.75.75 0 0 1 0 1.06l-.899.899-2.033-2.033zm-1.96 1.96-6.342 6.342a.75.75 0 0 0-.203.376l-.498 2.358 2.358-.497a.75.75 0 0 0 .376-.204l6.343-6.342z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )

        },
      }

    ],
    []
  );

  // Table setup
  const table = useReactTable({
    data: buyerData ?? [],
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return matchSorter([value], filterValue).length > 0;
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleUpdateModalOpen = (buyer: Buyer) => {
    setIsOpenUpdateModal(true)
    setSelectedBuyer(buyer)
  }

  const handleDeleteModalOpen = (buyer: Buyer) => {
    setIsOpenDeleteModal(true)
    setSelectedBuyer(buyer)
  }

  if (!buyerData) return <div>Loading...</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-full">
          {/* Search */}
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4 dark:text-gray-400">
            <input
              type="text"
              placeholder="Search Buyers..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 border rounded-md dark:bg-white/[0.05]"
            />

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
              <select
                className="ml-2 border rounded p-1"
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
              >
                {[5, 10, 20, 40].map((sz) => (
                  <option key={sz} value={sz}>
                    Show {sz}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Responsive Table Container */}
          <div className="overflow-x-auto">
            <Table>
              {/* Headers */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableCell
                        key={header.id}
                        isHeader
                        onClick={header.column.getToggleSortingHandler()}
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc"
                          ? " 🔼"
                          : header.column.getIsSorted() === "desc"
                            ? " 🔽"
                            : ""}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              {/* Rows */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center dark:text-gray-400">
                      No Users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-5 py-4 sm:px-6 text-start dark:text-gray-400">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center p-4 text-sm">
            <div className="flex gap-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-2 py-1 border rounded disabled:opacity-50 dark:text-gray-400"
              >
                {"<<"}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-2 py-1 border rounded disabled:opacity-50 dark:text-gray-400"
              >
                {"<"}
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-2 py-1 border rounded disabled:opacity-50 dark:text-gray-400"
              >
                {">"}
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-2 py-1 border rounded disabled:opacity-50 dark:text-gray-400"
              >
                {">>"}
              </button>
            </div>

            <div className="dark:text-gray-400">
              Showing{" "}
              <strong>
                {table.getRowModel().rows.length} / {buyerData.length}
              </strong>{" "}
              results
            </div>
          </div>

          {isOpenUpdateModal && (
            <UpdateUserModal isOpenModel={isOpenUpdateModal}
              setIsOpenModel={setIsOpenUpdateModal} userData={selectedBuyer} />
          )}
          {isOpenDeleteModal && (
            <DeleteUserModal isOpenDeleteModel={isOpenDeleteModal}
              setIsOpenDeleteModal={setIsOpenDeleteModal} userData={selectedBuyer} role="buyer" />
          )}
        </div>
      </div>
    </div>
  );
}