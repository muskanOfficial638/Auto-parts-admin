/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useMemo, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
interface Pages {
    title: string,
    slug: string,
    status: string,
    created_at: string,
    updated_at: string,
    id: string
}

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/Alert-dialog";

import { PagesTable, PageRow } from "@/components/tables/PagesTable";
import { deletePage, getAllPages } from "@/app/utils/api";
import PageEditorForm from "@/components/form/PageEditorForm";
import HomePageEditorForm from "@/components/form/HomePageEditorForm";

const CmsPages = () => {

    const autoPartsUserData: any = localStorage.getItem("autoPartsUserData");
    const loggedInUser = JSON.parse(autoPartsUserData);
    const [data, setData] = useState<Pages[]>([]);

    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isHomeOpenUpdateModal, setIsHomeOpenUpdateModal] = useState(false);
    const [pageUpdateValue, setPageUpdateValue] = useState(false);
    
    const [selectedPage, setSelectedPage] = useState<string | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteConfig, setDeleteConfig] = useState<{
        level: string;
        id: string;
        parentIds?: any;
    }>({ level: "", id: "" });


    useEffect(() => {

        const fetchData = async () => {
            const makeData = await getAllPages();
            // console.log("makeData", makeData)
            setData(makeData);
        };
        fetchData();
    if(pageUpdateValue) {
        setPageUpdateValue(false);
        fetchData();
    }
    }, [pageUpdateValue]);
console.log("data",pageUpdateValue  )
    const handleUpdateModalOpen = (pageId: string,pageSlug: string ) => {
       if(pageSlug=="/"){
        setIsHomeOpenUpdateModal(true)
        setSelectedPage(pageId)
       }else{
        setIsOpenUpdateModal(true)
        setSelectedPage(pageId)
       }
    }
  const handleAddNew = () => {
        setIsOpenUpdateModal(true)
        setSelectedPage(null)
    }   

    const handleDelete = (level: string, id: string, pageSlug?: string) => {
        if(pageSlug=="/"){
            toast.error("Home page cannot be deleted");
            return;
        }
        setDeleteConfig({ level, id });
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        const {  id } = deleteConfig;
        await deletePage(id, loggedInUser?.access_token)
        setData((prevData) => {
            const newData = [...prevData];
            return newData.filter((m) => m.id !== id);
            return newData;
        });

        toast.success(`Page deleted successfully`);
        setDeleteDialogOpen(false);
    };



    const pagesData = useMemo((): PageRow[] => {
        return data.map((make) => ({
            title: make.title,
            slug: make.slug,
            status: make.status,
            created_at: make.created_at,
            updated_at: make.updated_at,
            id: make.id,

        }));
    }, [data]);


    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <ToastContainer />
            <div className="border-b bg-card">
                <div className="container mx-auto px-6 py-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-foreground mb-2 dark:text-gray-400">
                        Pages
                    </h1>
                    <Button onClick={handleAddNew} className="dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm" >
                        <Plus className="h-4 w-4 mr-2 dark:text-gray-400" />
                        Add Page
                    </Button>
                </div>
            </div>
            <div className="container mx-auto px-6 py-8 overflow-x-auto">
                <PagesTable
                    data={pagesData}
                    onEdit={(pageId: string,pageSlug: string) => handleUpdateModalOpen(pageId,pageSlug)}
                    onDelete={(pageId: string,pageSlug: string) => handleDelete("page", pageId,pageSlug)}
                />
            </div>

            {isOpenUpdateModal && (
                <PageEditorForm isOpenModel={isOpenUpdateModal}
                    setIsOpenModel={setIsOpenUpdateModal} pageData={selectedPage}  setPageUpdate={setPageUpdateValue} />
            )}
            {isHomeOpenUpdateModal && (
                <HomePageEditorForm isOpenModel={isHomeOpenUpdateModal}
                    setIsOpenModel={setIsHomeOpenUpdateModal} pageData={selectedPage}  setPageUpdate={setPageUpdateValue} />
            )}


            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the{" "}
                            {deleteConfig.level} and all its nested data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 text-white" onClick={confirmDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default CmsPages;


