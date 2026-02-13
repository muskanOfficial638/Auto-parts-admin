/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { handleSaveOrUpdateMake, handleSaveOrUpdateTrim } from "@/app/utils/apiHelpers";
import { adminApiPath, viewVehicleMake } from "@/app/utils/api";
import { ChevronDownIcon } from "lucide-react";
import Select from "./Select";



interface Trim1 {
    id: string;
    trim: string;
    year_from: number;
    year_to: number;
}

interface Model1 {
    id: string;
    name: string;
    trims: Trim1[];
}

interface Make1 {
    make_id: string;
    make_name: string;
    models: Model1[];
}

interface VehicleFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    level: string;
    title: string;
    description: string;
    initialValue?: string;
    levelData: Model | Trim | any;
    editId?: string;
    onSave: (value: string) => void;
    vehicleMakeData: Make1[];
}

interface VehicleMake {
    make_name: string;
    make_id: string;
    models: Model[];
}

interface Trim {
    id: string;
    trim: string;
    model_id?: string;
    make_id?: string;
    year_from: number;
    year_to: number;
}

interface Model {
    id: string;
    name: string;
    make_id: string;
    trims: Trim[];
    model_id?: string;
}






export const VehicleFormDialog = ({
    open,
    onOpenChange,
    level,
    title,
    description,
    initialValue = "",
    onSave,
    editId,
    levelData,
    vehicleMakeData
}: VehicleFormDialogProps) => {
    type SelectOption = {
        value: string;
        label: string;
    };
    const [value, setValue] = useState(initialValue);
    const [data, setData] = useState<Model | Trim | any>(null);
    const [error, setError] = useState(initialValue);
    const [selectMakeOptions, setSelectMakeOptions] = useState<SelectOption[]>([]);
    const [selectModelOptions, setSelectModelOptions] = useState<SelectOption[]>([]);
    const [selectedMake, setSelectedMake] = useState<VehicleMake | any>(null);
    const [selectedModel, setSelectedModel] = useState<Model | any>(null);
    const [accessToken, setToken] = useState('');
    const [yearFrom, setYearFrom] = useState(0);
    const [yearTo, setYearTo] = useState(0);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const autoPartsUserData = localStorage.getItem("autoPartsUserData");
            const loggedInUser = JSON.parse(autoPartsUserData || "{}");
            setToken(loggedInUser.access_token)
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setValue(initialValue);
            setData(levelData);
            setYearTo(levelData?.year_to)
            setYearFrom(levelData?.year_from)
            if (level === "model" || level === "trim") {
                try {

                    const selectedMake = vehicleMakeData.find((make: Make1) => make.make_id === levelData?.make_id);
                    console.log("Selected Make:", selectedMake);
                    if (!selectedMake) {
                        setSelectModelOptions([]);
                        return;
                    }

                    setSelectModelOptions(
                        selectedMake.models.map((item: Model1) => ({
                            value: item.id,
                            label: item.name,
                        }))
                    );

                    if (selectedMake) {

                        setSelectedMake(null);
                        // const selectedModel = selectedMake?.models.find((model: Model) => model.id === levelData?.model_id)
                        const selectedModel = selectedMake?.models.find((model: Model1) => model.id === levelData?.model_id)
                        setSelectedModel(selectedModel)
                    } else {
                        console.warn("Make not found for ID:", levelData?.make_id);
                    }

                } catch (error) {
                    console.error("Error fetching vehicle make data:", error);
                }
            }
        };

        fetchData();
        setSelectedMake(null);
    }, [vehicleMakeData,initialValue, open, levelData, level]);

    useEffect(() => {
        viewVehicleMake().then((data) => {
            // Convert API data to select options
            const vehicleOptions = data.map((item: VehicleMake) => ({
                value: item.make_id,
                label: item.make_name,
            }));
            setSelectMakeOptions(vehicleOptions);
        });
    }, [initialValue, open, levelData, level]);

    const handleValueChange = (e: any) => {
        setValue(e.target.value);
        if (e.target.value?.length < 2) {
            setError('Name can not be less than 2 character short');
        }
        else if (e.target.value?.length > 25) {
            setError('Name can not be nore than 25 characters long');
        }
        else {
            setError('');
        }
    };

    const handleYearFromChange = (value: any) => {
        setYearFrom(value);

        const yearRegex = /^\d{4}$/;
        const currentYear = new Date().getFullYear();

        if (!yearRegex.test(value)) {
            setError('Please enter a valid 4-digit year (e.g., 2020)');
        } else if (parseInt(value) > currentYear) {
            setError(`Year From cannot be in the future (max: ${currentYear})`);
        } else {
            setError('');
        }
    };

    const handleYearToChange = (value: any) => {
        setYearTo(value);

        const yearRegex = /^\d{4}$/;
        const currentYear = new Date().getFullYear();
        if (!yearRegex.test(value)) {
            setError('Please enter a valid 4-digit year (e.g., 2020)');
        } else if (parseInt(value) > currentYear) {
            setError(`Year To cannot be in the future (max: ${currentYear})`);
        } else {
            setError('');
        }
    };


    const handleSelectMakeChange = async (option: string) => {
        const selectedId = option;
        const vehicleMakeData = await viewVehicleMake()
        // Find the corresponding make name from your makes array
        const selectedMake = vehicleMakeData.find((make: VehicleMake) => make.make_id === selectedId);
        if (selectedMake) {
            setSelectedMake(selectedMake);
            const selectedModel = selectedMake?.models.find((model: Model) => model.id)
            setSelectedModel(selectedModel)
        } else {
            console.warn("Make not found for ID:", selectedId);
        }

        setSelectModelOptions(selectedMake?.models.map((item: Model) => ({
            value: item.id,
            label: item.name,
        })));

    };

    const handleSelectModelChange = async (option: string) => {
        const selectedModel = selectedMake?.models.find((model: Model) => model.id === option)
        setSelectedModel(selectedModel)
    };

    const handleSaveAndUpdate = (e: React.FormEvent) => {
        const endpoint = `${adminApiPath}/vehicle/${level}`;
        const makeId = selectedMake ? selectedMake.make_id : level === 'make' ? editId : levelData?.make_id ;
        const modelId = selectedModel ? selectedModel.id : editId;
        console.log("Selected Make ID:", makeId);
        console.log("Selected Model ID:", modelId);
        if (level !== 'make' && !makeId) {
            setError("Make is required!")
            return
        }

        if (error) {
            return
        }
        if (level === 'trim') {
            const currentYear = new Date().getFullYear();
            if (yearTo > currentYear || yearFrom > currentYear) {
                setError(`Year cannot be in the future (max: ${currentYear})`);
                return
            }
            if (yearFrom >= yearTo) {
                setError(`Year From value cannot be more than or equal to Year To value!`);
                return
            }
            handleSaveOrUpdateTrim({
                e,
                level: level,
                trim: value,
                make_id: makeId,
                model_id: modelId,
                year_from: yearFrom,
                year_to: yearTo,
                id: editId,
                isUpdate: !!editId,
                endpoint,
                onSuccess: async () => {
                    setError("");
                    onSave(value.trim());
                    setTimeout(() => {
                        setValue("");
                        onOpenChange(false);
                    }, 1000);
                },
                onError: (msg: string) => setError(msg),
                token: accessToken
            })
        } else {
            handleSaveOrUpdateMake({
                e,
                level: level,
                name: value,
                make_id: makeId,
                id: modelId,
                isUpdate: !!editId, // This should be true only if editId exists
                endpoint,
                onSuccess: async () => {
                    setError("");
                    onSave(value.trim());
                    setTimeout(() => {
                        setValue("");
                        onOpenChange(false);
                    }, 2000);
                },
                onError: (msg: string) => setError(msg),
                token: accessToken
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSaveAndUpdate(e);
        }
    };

    return (
        <Dialog open={open} onOpenChange={() => { onOpenChange(!open); setError(''); setSelectedMake(null); setSelectedModel(null) }}>
            <DialogContent className="w-full bg-white dark:bg-gray-900">
                <DialogHeader>
                    <DialogTitle className="dark:text-gray-400">{title}</DialogTitle>
                    <DialogDescription className="dark:text-gray-400">{description}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {level !== 'make' && (
                        <div className="grid gap-2">
                            <Label>Select Vehicle Make</Label>
                            <div className="relative">
                                <Select
                                    options={selectMakeOptions}
                                    placeholder="Select make"
                                    onChange={handleSelectMakeChange}
                                    className="dark:bg-dark-900"
                                    value={selectedMake?.make_id || data?.make_id}
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon />
                                </span>
                            </div>
                        </div>
                    )}

                    {level === 'trim' &&
                        (selectMakeOptions && selectModelOptions?.length ? (
                            <div className="grid gap-2">
                                <Label>Select Vehicle Model</Label>
                                <div className="relative">
                                    <Select
                                        options={selectModelOptions}
                                        placeholder="Select model"
                                        onChange={handleSelectModelChange}
                                        className="dark:bg-dark-900"
                                        value={selectedModel?.id || data?.model_id}
                                    />
                                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                        <ChevronDownIcon />
                                    </span>
                                </div>
                            </div>
                        ) : <span className="text-error-500">No model found for this make</span>)}

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={value}
                            onChange={(e: any) => handleValueChange(e)}
                            onKeyDown={handleKeyDown}
                            placeholder={`Enter ${level} name`}
                            autoFocus
                            max="4"
                        />
                    </div>

                    {level === 'trim' && (
                        <div className="flex space-y-4 gap-4">
                            <div>
                                <Label htmlFor="name">Year From:</Label>
                                <Input
                                    id="year_from"
                                    name="year_from"
                                    value={yearFrom}
                                    type="number"
                                    onChange={(e: any) => handleYearFromChange(e.target.value)}
                                    placeholder={`Year From`}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <Label htmlFor="name">Year To:</Label>
                                <Input
                                    id="year_to"
                                    name="year_to"
                                    type="number"
                                    onChange={(e: any) => handleYearToChange(e.target.value)}
                                    value={yearTo}
                                    placeholder={`Year To`}
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}
                </div>
                {error && (<span className="text-error-500">{error}</span>)}
                <DialogFooter>
                    <Button variant="outline" onClick={() => { onOpenChange(false); setError('') }} className="dark:text-gray-400">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveAndUpdate} disabled={!value.trim()} className="dark:text-gray-400">
                        {!editId ? 'Save' : 'Update'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
