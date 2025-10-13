/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const authApiPath = "http://192.168.1.4:8001/v1";
export const adminApiPath = "http://192.168.1.4:8000/v1/admin";
export const vehicleApiPath = "http://192.168.1.4:8006/v1/vehicle";

// user profiles
export async function fetchUsers(role: string, token: string) {
  const res = await fetch(`${adminApiPath}/manage-users/${role}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch profiles");
  return res.json();
}

// update user
export async function updateUser(role: string, token: string, userData: any) {
  return axios.patch(
    `${adminApiPath}/manage-users/${role}/${userData?.id}`,
    { ...userData },
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }
  )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error("unable to update user", error);
      throw error;
    });
}

// delete user
export async function deleteUser(token: string, userId: string) {
  return axios.delete(
    `${adminApiPath}/manage-users/${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }
  )
    .then((response) => {
      // console.log("delete response",response)
      return response;
    })
    .catch((error) => {
      console.error("unable to delete user", error);
      throw error;
    });
}

//verify-email
export async function verifyEmail(token: string) {
  return axios.get(
    "/v1/auth/verify-email",
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }
  )
    .then((response) => {
      console.log("Verification success:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Verification failed:", error);
      throw error;
    });
}

// resend Verifiaction
export async function sendVerification(email: string) {
  return axios.post(
    `${authApiPath}/auth/resend-verification?email=${email}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      console.log("Verification success:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Verification failed:", error);
      throw error;
    });
}


// Admin logs
export async function fetchAdminLogs(token: string) {
  const res = await fetch(`${adminApiPath}/logs`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to load admin logs");
  return res.json();
}

// delete user
export async function deleteAdminLogs(token: string, logId: string) {
  return axios.delete(
    `${adminApiPath}/logs/${logId}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }
  )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error("unable to delete user", error);
      throw error;
    });
}

// Get Vehicle makes
export async function viewVehicleMake() {
  const res = await fetch(`${vehicleApiPath}/view/`, {
    cache: "no-store",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to vehicle makes");
  return res.json();
}

// Delete Vehicle make
export async function deleteVehicle(level: string, makeId: string) {
  return axios.delete(
    `${vehicleApiPath}/${level}/${makeId}`,
    {
      headers: {
        "Content-Type": "application/json"
      },
    }
  )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error("unable to delete user", error);
      throw error;
    });
}

// Vehicle model by make name
export async function fetchVehicleModelByMake(makeName: string) {
  const res = await fetch(`${vehicleApiPath}/model/${makeName}`, {
    cache: "no-store",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to vehicle model by make name");
  return res.json();
}


