/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
// import { toast } from "react-toastify";

interface SaveOrUpdateParamsForMake {
  e: React.FormEvent;
  level?: string,
  name: string;
  make_id?: string;
  id?: string;
  isUpdate: boolean;
  endpoint: string;
  model_id?: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
  token: string;
}

interface SaveOrUpdateParamsForTrim {
  e: React.FormEvent;
  level?: string,
  id?: string;
  isUpdate: boolean;
  endpoint: string;
  model_id?: string;
  make_id?: string;
  trim: string
  year_from: number;
  year_to: number;
  onSuccess: () => void;
  onError: (msg: string) => void;
  token: string;
}

export async function handleSaveOrUpdateMake({
  e,
  level,
  name,
  make_id,
  id,
  isUpdate,
  endpoint,
  onSuccess,
  onError,
  token
}: SaveOrUpdateParamsForMake) {
  e.preventDefault();
  // console.log(isUpdate , id , level);

  if (!name.trim()) {
    onError("Model Name cannot be empty");
    return;
  }

  if (isUpdate && !id && level === "model") {
    onError("Invalid Model ID.");
    return;
  }

  if (isUpdate && !make_id && level === "make") {
    onError("Invalid Make ID.");
    return;
  }

  const url = isUpdate ? `${level === "make" ? `${endpoint}/${make_id}` : `${endpoint}/${id}`}` : endpoint;
  const method = isUpdate ? "put" : "post";
  try {
    const response = await axios({
      method,
      url,
      data: { name, make_id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response=>", response);

    // toast(
    //   isUpdate ? "Vehicle Make updated successfully" : "Vehicle Make added successfully"
    // );

    onSuccess();
  } catch (err: any) {
    if (err.response) {
      console.error("Server error:", err.response.data);
      onError(err.response.data.message || "Request failed");
    } else if (err.request) {
      console.error("No response:", err.request);
      onError("No response from server");
    } else {
      console.error("Error:", err.message);
      onError("Unexpected error occurred");
    }
  }
}

export async function handleSaveOrUpdateTrim({
  e,
  year_from,
  year_to,
  model_id,
  make_id,
  trim,
  id,
  isUpdate,
  endpoint,
  onSuccess,
  onError,
  token
}: SaveOrUpdateParamsForTrim) {
  e.preventDefault();
  if (!trim.trim()) {
    onError("Trim Name cannot be empty");
    return;
  }

  if (isUpdate && !id) {
    onError("Invalid Trim ID.");
    return;
  }

  const url = isUpdate ? `${endpoint}/${id}` : endpoint;
  const method = isUpdate ? "put" : "post";

  try {
    const response = await axios({
      method,
      url,
      data: { trim, model_id, make_id, year_from, year_to },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });


    console.log("Response=>", response);

    // toast(
    //   isUpdate ? "Trim updated successfully" : "Trim added successfully"
    // );

    onSuccess();
  } catch (err: any) {
    if (err.response) {
      console.error("Server error:", err.response.data);
      onError(err.response.data.message || "Request failed");
    } else if (err.request) {
      console.error("No response:", err.request);
      onError("No response from server");
    } else {
      console.error("Error:", err.message);
      onError("Unexpected error occurred");
    }
  }
}

