"use client";

import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import type { SingleValue } from "react-select";
import { Close } from "@/icons";
import { toast } from "react-toastify";
import { viewVehicleMake } from "@/app/utils/api";

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

interface SelectOption {
  label: string;
  value: string;
  __isNew__?: boolean;
}

export default function AddVehicleFormDialog({ setShowAddVehicleForm, onSave }: { setShowAddVehicleForm: (show: boolean) => void, onSave: () => void }) {

  const [data, setData] = useState<Make[]>([]);
  const [make, setMake] = useState<SelectOption | null>(null);
  const [model, setModel] = useState<SelectOption | null>(null);
  const [modelOptions, setModelOptions] = useState<SelectOption[]>([]);
  const [yearFrom, setYearFrom] = useState<string>("");
  const [yearTo, setYearTo] = useState<string>("");
  const [trim, setTrim] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  let token = "";

  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("autoPartsUserData");

    if (raw) {
      const parsed = JSON.parse(raw);
      token = parsed?.access_token || "";
    }
  }

  useEffect(() => {
    viewVehicleMake()
      .then((res: Make[]) => setData(res))
      .catch(console.error);
  }, []);


  const makeOptions: SelectOption[] = data.map((m) => ({
    value: m.make_id,
    label: m.make_name,
  }));

  const handleMakeChange = (
    selected: SingleValue<SelectOption>
  ) => {
    setMake(selected);
    setModel(null);

    if (!selected) {
      setModelOptions([]);
      return;
    }

    const found = data.find(
      (m) => m.make_id === selected.value
    );

    if (found) {
      const models: SelectOption[] = found.models.map(
        (md) => ({
          value: md.id,
          label: md.name,
        })
      );

      setModelOptions(models);
    }
  };

  async function createMake(name: string) {
    const res = await fetch(
      "http://54.80.119.79:8000/v1/admin/vehicle/make/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      }
    );

    return await res.json();
  }

  async function createModel(makeId: string, name: string) {
    const res = await fetch(
      "http://54.80.119.79:8000/v1/admin/vehicle/model/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          make_id: makeId,
          name,
        }),
      }
    );

    return await res.json();
  }

  async function createTrim(payload: {
    make_id: string;
    model_id: string;
    year_from: number;
    year_to: number;
    trim: string;
  }) {
    const res = await fetch(
      "http://54.80.119.79:8000/v1/admin/vehicle/trim/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    return await res.json();
  }

  const handleSubmit = async () => {
    try {
      if (!make || !model || !yearFrom || !yearTo || !trim) {
        
        toast.error(`Please fill all fields`);
        return;
      }

      setLoading(true);

      let makeId = make.value;
      let modelId = model.value;

      if (make.__isNew__) {
        const newMake = await createMake(make.label);
        makeId = newMake.id;
      }
      if (model.__isNew__) {
        const newModel = await createModel(
          makeId,
          model.label
        );
        modelId = newModel.id;
      }
      const payload = {
        make_id: makeId,
        model_id: modelId,
        year_from: Number(yearFrom),
        year_to: Number(yearTo),
        trim,
      };

      await createTrim(payload);
       toast.success(`Trim Created Successfully!`);
       setShowAddVehicleForm(false);
       onSave();


    } catch (err) {
      console.error(err);
       toast.error(`Something went wrong!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000a6] bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="max-w-lg p-6 bg-white shadow rounded space-y-4 relative w-full rounded-lg">
        <h2 className="text-center block mb-1 font-medium text-lg">Add Vehicle </h2>
        <span className="absolute top-4 right-4 cursor-pointer bg-gray-100 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200" onClick={() => setShowAddVehicleForm(false)}><Close className="h-6 w-6 text-red-500 hover:text-red-700" /></span>
      <div>
        <label className="block mb-1 font-medium text-sm">
          Vehicle Make
        </label>

        <CreatableSelect<SelectOption, false>
          options={makeOptions}
          value={make}
          onChange={handleMakeChange}
          placeholder="Select / Type Make"
          isClearable
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-sm">
          Vehicle Model
        </label>

        <CreatableSelect<SelectOption, false>
          options={modelOptions}
          value={model}
          onChange={(val) => setModel(val)}
          placeholder="Select / Type Model"
          isDisabled={!make}
          isClearable
        />
      </div>

      <div className="flex gap-3">
        <input
          type="number"
          placeholder="Year From"
          className="w-1/2 border p-2 rounded"
          value={yearFrom}
          onChange={(e) =>
            setYearFrom(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Year To"
          className="w-1/2 border p-2 rounded"
          value={yearTo}
          onChange={(e) =>
            setYearTo(e.target.value)
          }
        />
      </div>

      <input
        type="text"
        placeholder="Trim Name"
        className="w-full border p-2 rounded"
        value={trim}
        onChange={(e) =>
          setTrim(e.target.value)
        }
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-brand-500 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Saving..." : "Save Trim"}
      </button>

    </div>
    </div>
  );
}
