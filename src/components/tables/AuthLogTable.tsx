/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
import { useEffect, useMemo, useState } from "react";
import { matchSorter } from "match-sorter";
import { Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { deleteAdminLogs, fetchAdminLogs } from "@/app/utils/api";
import { toast, ToastContainer } from "react-toastify";

interface Log {
    id: string;
    user_id?: string;
    level: string;
    action: string;
    path: string;
    ip: string;
    user_agent: string;
    meta: {
        email: string;
    };
    created_at: string;
}

export default function AuthLogTable() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [totalPage, setTotalPage] = useState(0);
    const [logsCount, setLogsCount] = useState(0);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    // Fetch logs
    useEffect(() => {
        if (typeof window !== 'undefined') {

        
          
                fetchAdminLogs( 1, 40).then((data) => {
                    setLogsCount(data?.total);
                    setTotalPage(data?.pages)
                    if (data?.items) setLogs(data.items);
                });
            
        }
    }, []);

    async function handleDeleteLog(logId: string) {

        try {
            const response = await deleteAdminLogs( logId)
            if (response) {
                toast("Log deleted successfully");
                fetchAdminLogs( 1, 40).then((data) => {
                    if (data?.items) setLogs(data.items);
                });
            }
        } catch (err: any) {
            // Handle errors more gracefully
            if (err.response) {
                // Server responded with a status other than 2xx
                console.error("Server error:", err.response.data);
                toast(err.response.data.detail || "log not found");
            } else if (err.request) {
                // Request was made but no response received
                console.error("No response:", err.request);
                toast("No response from server");
            } else {
                // Something else happened
                console.error("Error:", err.message);
                toast("Unexpected error occurred");
            }
        }
    }

    // Columns for TanStack Table
    const columns = useMemo<ColumnDef<Log>[]>(
        () => [
            {
                header: "Event",
                accessorKey: "action",
            },
            {
                header: "Email",
                accessorFn: (row) => row.meta.email,
                id: "email",
            },
            {
                header: "Path",
                accessorKey: "path",
            },
            {
                header: "Level",
                accessorKey: "level",
                cell: ({ row }) => (
                    <Badge
                        size="sm"
                        color={row.original.level !== "WARNING" ? "success" : "warning"}
                    >
                        {row.original.level}
                    </Badge>
                ),
            },
            {
                header: "IP",
                accessorKey: "ip",
            },
            {
                header: "Action",
                id: "delete",
                cell: ({ row }) => (
                    <button
                        onClick={() => handleDeleteLog(row.original.id)}
                        className="text-gray-500 hover:text-red-600 dark:hover:text-red-500 transition"
                        title="Delete log"
                    >
                        <Trash2 className="h-4 w-4 text-error-500" />
                    </button>
                ),
            },
        ],
        []
    );

    // Table setup
    const table = useReactTable({
        data: logs,
        columns,
        // manualPagination: true,
        // pageCount: totalPage, 
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

    const handlePageChange = async (newPageIndex: number) => {
  
        try {
            const data = await fetchAdminLogs(
            
                newPageIndex + 1,              // API page starts from 1
                table.getState().pagination.pageSize
            );

            table.setPageIndex(newPageIndex);  // update UI table
            setLogs(data.results);             // update state
        } catch (error) {
            console.error(error);
        }
    };

    const handlePageSizeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = Number(e.target.value);

        try {
            const data = await fetchAdminLogs(
             
                1,         // reset to page 1 when pageSize changes
                newSize
            );

            table.setPageSize(newSize);
            table.setPageIndex(0);
            setLogs(data.results);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <ToastContainer />
            {/* Search */}
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4 dark:text-gray-400">
                <input
                    type="text"
                    placeholder="Search logs..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-full sm:w-64 px-3 py-2 border rounded-md dark:bg-white/[0.05]"
                />

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {/* {table.getPageCount()} */}
                    {totalPage}
                    <select
                        className="ml-2 border rounded p-1"
                        value={table.getState().pagination.pageSize}
                        // onChange={(e) => table.setPageSize(Number(e.target.value))}
                        onChange={handlePageSizeChange}
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
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => (
                                    <TableCell
                                        key={header.id}
                                        isHeader
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="cursor-pointer select-none text-theme-xs dark:text-gray-400"
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
                    <TableBody>
                        {table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center dark:text-gray-400">
                                    No logs found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="border border-1 p-4 dark:text-gray-400">
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
                        // onClick={() => table.setPageIndex(0)}
                        onClick={() => handlePageChange(0)}
                        disabled={!table.getCanPreviousPage()}
                        className="px-2 py-1 border rounded disabled:opacity-50 dark:text-gray-400"
                    >
                        {"<<"}
                    </button>

                    <button
                        onClick={() => handlePageChange(table.getState().pagination.pageIndex - 1)}
                        disabled={!table.getCanPreviousPage()}
                        className="px-2 py-1 border rounded disabled:opacity-50 dark:text-gray-400"
                    >
                        {"<"}
                    </button>

                    <button
                        // onClick={() => table.nextPage()}
                        onClick={() => handlePageChange(table.getState().pagination.pageIndex + 1)}
                        disabled={!table.getCanNextPage()}
                        className="px-2 py-1 border rounded disabled:opacity-50 dark:text-gray-400"
                    >
                        {">"}
                    </button>

                    <button
                        // onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        onClick={() => handlePageChange(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                        className="px-2 py-1 border rounded disabled:opacity-50 dark:text-gray-400"
                    >
                        {">>"}
                    </button>

                </div>

                <div className="dark:text-gray-400">
                    Showing{" "}
                    <strong>
                        {table.getRowModel().rows.length} / {logsCount}
                        {/* {table.getRowModel().rows.length} / {logs.length} */}
                    </strong>{" "}
                    results
                </div>
            </div>
        </div>
    );
}
