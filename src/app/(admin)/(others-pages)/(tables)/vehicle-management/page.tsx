/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useMemo, useEffect } from "react";
import { VehicleFormDialog } from "@/components/form/VehicleFormDialog";
import { toast, ToastContainer } from "react-toastify";

interface Trim {
    id: string;
    trim: string;
    year_from: number;
    year_to: number;
}

interface Model {
    id: string;
    name: string;
    trims: Trim[];
}

interface Make {
    make_id: string;
    make_name: string;
    models: Model[];
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { MakesTable, MakeRow } from "@/components/tables/MakesTable";
import { ModelsTable, ModelRow } from "@/components/tables/ModelsTable";
import { TrimsTable, TrimRow } from "@/components/tables/TrimsTable";
import { deleteVehicle, viewVehicleMake } from "@/app/utils/api";

const VehicleManagement = () => {
    const [data, setData] = useState<Make[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogConfig, setDialogConfig] = useState<{
        level: string;
        title: string;
        description: string;
        parentIds?: any;
        editId?: string;
        initialValue?: string;
        levelData?: Model | Trim | any;
    }>({
        level: "",
        title: "",
        description: "",
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteConfig, setDeleteConfig] = useState<{
        level: string;
        id: string;
        parentIds?: any;
    }>({ level: "", id: "" });
    const [activeTab, setActiveTab] = useState("makes");

    // Use useEffect to fetch the data asynchronously
    useEffect(() => {
        const fetchData = async () => {
            const makeData = await viewVehicleMake();
            // console.log("makeData", makeData)
            setData(makeData);
        };
        fetchData();
    }, []);

    // const generateId = () => Math.random().toString(36).substring(7);

    const handleAddMake = () => {
        setDialogConfig({
            level: "make",
            title: "Add Vehicle Make",
            description: "Add a new vehicle make/brand",
        });
        setDialogOpen(true);
    };

    const handleAddModel = (makeId: string) => {
        setDialogConfig({
            level: "model",
            title: "Add Vehicle Model",
            description: "Add a new vehicle model",
            parentIds: { makeId },
        });
        setDialogOpen(true);
    };

    const handleAddTrim = (makeId: string, modelId: string) => {
        setDialogConfig({
            level: "trim",
            title: "Add Vehicle Trim",
            description: "Add a new vehicle trim level",
            parentIds: { makeId, modelId },
        });
        setDialogOpen(true);
    };

    const handleEdit = (level: string, id: string, parentIds?: any) => {
        let currentValue = "";
        let levelData: Model | Trim | any = {};

        if (level === "make") {
            const make = data.find((m) => m.make_id === id);
            currentValue = make?.make_name || "";
        } else if (level === "model" && parentIds) {
            const make = data.find((m) => m.make_id === parentIds.makeId);
            const model = make?.models.find((m) => m.id === id);
            currentValue = model?.name || "";
            levelData = model
        } else if (level === "trim" && parentIds) {
            const make = data.find((m) => m.make_id === parentIds.makeId);
            const model = make?.models.find((m) => m.id === parentIds.modelId);
            const trim = model?.trims.find((t) => t.id === id);
            currentValue = trim?.trim || "";
            levelData = trim
        }

        setDialogConfig({
            level,
            title: `Edit ${level.charAt(0).toUpperCase() + level.slice(1)}`,
            description: `Update the ${level} name`,
            parentIds,
            editId: id,
            initialValue: currentValue,
            levelData: levelData
        });
        setDialogOpen(true);
    };

    const handleDelete = (level: string, id: string, parentIds?: any) => {
        setDeleteConfig({ level, id, parentIds });
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        const { level, id, parentIds } = deleteConfig;
        await deleteVehicle(level, id)

        setData((prevData) => {
            const newData = [...prevData];

            if (level === "make") {
                return newData.filter((m) => m.make_id !== id);
            } else if (level === "model" && parentIds) {
                const make = newData.find((m) => m.make_id === parentIds.makeId);
                if (make) {
                    make.models = make.models.filter((m) => m.id !== id);
                }
            } else if (level === "trim" && parentIds) {
                const make = newData.find((m) => m.make_id === parentIds.makeId);
                const model = make?.models.find((m) => m.id === parentIds.modelId);
                if (model) {
                    model.trims = model.trims.filter((t) => t.id !== id);
                }
            }

            return newData;
        });

        toast.success(`${level.charAt(0).toUpperCase() + level.slice(1)} deleted successfully`);
        setDeleteDialogOpen(false);
    };

    const handleSave = async (value: string) => {
        const { level, parentIds, editId } = dialogConfig;
        //  console.log("level",level);
        if (editId) {
            // Edit existing
            setData((prevData) => {
                const newData = [...prevData];

                if (level === "make") {
                    const make = newData.find((m) => m.make_id === editId);
                    if (make) make.make_name = value;
                } else if (level === "model" && parentIds) {
                    const make = newData.find((m) => m.make_id === parentIds.makeId);
                    const model = make?.models.find((m) => m.id === editId);
                    if (model) model.name = value;
                } else if (level === "trim" && parentIds) {
                    const make = newData.find((m) => m.make_id === parentIds.makeId);
                    const model = make?.models.find((m) => m.id === parentIds.modelId);
                    const trim = model?.trims.find((t) => t.id === editId);
                    if (trim) trim.trim = value;
                }

                return newData;
            });
            toast.success(`${level.charAt(0).toUpperCase() + level.slice(1)} updated successfully`);
        } else {
            const Data1 = await viewVehicleMake()
            // Add new
            // setData((prevData) => {
            //     const newData = [...prevData];
            //     if (level === "make") {
            //         newData.push({ id: generateId(), make_name: value, models: [] });

            //     } else if (level === "model" && parentIds) {
            //         const make = newData.find((m) => m.id === parentIds.makeId);
            //         if (make) {
            //             make.models.push({ id: generateId(), name: value, trims: [] });
            //         }
            //     } else if (level === "trim" && parentIds) {
            //         const make = newData.find((m) => m.id === parentIds.makeId);
            //         const model = make?.models.find((m) => m.id === parentIds.modelId);
            //         if (model) {
            //             model.trims.push({
            //                 id: generateId(),
            //                 trim: value,
            //                 year_from: 2024,
            //                 year_to: 2024
            //             });
            //         }
            //     }

            //     return newData;
            // });
            setData(Data1);
            toast.success(`${level.charAt(0).toUpperCase() + level.slice(1)} added successfully`);
        }
    };

    const makesData = useMemo((): MakeRow[] => {
        return data.map((make) => ({
            id: make.make_id,
            name: make.make_name,
            modelCount: make.models.length,
        }));
    }, [data]);

    const modelsData = useMemo((): ModelRow[] => {
        const models: ModelRow[] = [];
        data.forEach((make) => {
            make.models.forEach((model) => {
                models.push({
                    id: model.id,
                    name: model.name,
                    makeName: make.make_name,
                    makeId: make.make_id,
                    trimCount: model.trims.length,
                });
            });
        });
        return models;
    }, [data]);

    const trimsData = useMemo((): TrimRow[] => {
        const trims: TrimRow[] = [];
        data.forEach((make) => {
            make.models.forEach((model) => {
                model.trims.forEach((trim) => {
                    trims.push({
                        id: trim.id,
                        trim: trim.trim,
                        modelName: model.name,
                        makeName: make.make_name,
                        makeId: make.make_id,
                        modelId: model.id,
                        year_from: trim.year_from,
                        year_to: trim.year_to,
                    });
                });
            });
        });
        return trims;
    }, [data]);

    return (
        <div className="min-h-screen bg-background">
            <ToastContainer />
            <div className="border-b bg-card">
                <div className="container mx-auto px-6 py-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Vehicle Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your vehicle part exchange marketplace inventory
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex justify-between items-center mb-6">
                        <TabsList>
                            <TabsTrigger value="makes">Makes</TabsTrigger>
                            <TabsTrigger value="models">Models</TabsTrigger>
                            <TabsTrigger value="trims">Trims</TabsTrigger>
                        </TabsList>

                        <div className="flex gap-2">
                            {activeTab === "makes" && (
                                <Button onClick={handleAddMake}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Make
                                </Button>
                            )}
                            {activeTab === "models" && (
                                <Button
                                    onClick={() =>
                                        handleAddModel(data[0]?.make_id || "")
                                    }
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Model
                                </Button>
                            )}
                            {activeTab === "trims" && (
                                <Button
                                    onClick={() =>
                                        handleAddTrim(
                                            data[0]?.make_id || "",
                                            data[0]?.models[0]?.id || ""
                                        )
                                    }
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Trim
                                </Button>
                            )}
                        </div>
                    </div>

                    <TabsContent value="makes">
                        <MakesTable
                            data={makesData}
                            onEdit={(makeId: string) => handleEdit("make", makeId)}
                            onDelete={(makeId: string) => handleDelete("make", makeId)}
                        />
                    </TabsContent>

                    <TabsContent value="models">
                        <ModelsTable
                            data={modelsData}
                            onEdit={(modelId: string, makeId: string) =>
                                handleEdit("model", modelId, { makeId })
                            }
                            onDelete={(modelId: string, makeId: string) =>
                                handleDelete("model", modelId, { makeId })
                            }
                        />
                    </TabsContent>

                    <TabsContent value="trims">
                        <TrimsTable
                            data={trimsData}
                            onEdit={(trimId: string, makeId: string, modelId: string) =>
                                handleEdit("trim", trimId, { makeId, modelId })
                            }
                            onDelete={(trimId: string, makeId: string, modelId: string) =>
                                handleDelete("trim", trimId, { makeId, modelId })
                            }
                        />
                    </TabsContent>
                </Tabs>
            </div>

            <VehicleFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                level={dialogConfig.level}
                title={dialogConfig.title}
                description={dialogConfig.description}
                initialValue={dialogConfig.initialValue}
                levelData={dialogConfig?.levelData}
                onSave={handleSave}
                editId={dialogConfig?.editId ? dialogConfig?.editId : ''}
            />

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
                        <AlertDialogAction onClick={confirmDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default VehicleManagement;


