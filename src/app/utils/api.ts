/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

// API paths for LOCAL
// export const authApiPath = "http://54.80.119.79:8001/v1";
// export const adminApiPath = "http://54.80.119.79:8000/v1/admin";
// export const vehicleApiPath = "http://54.80.119.79:8006/v1/vehicle";
// export const deleteVehicleApiPath = "http://54.80.119.79:8000/v1/admin/vehicle";
// export const partRequestPath = "http://54.80.119.79:8005/v1/supplier";

//image path
//export const imagePath = "http://54.80.119.79:8000/image/"; 
export const imagePath = "/api/image-proxy/" 

//API paths for Vercel
export const authApiPath = "/api/auth";
export const adminApiPath = "/api/admin";
export const vehicleApiPath = "/api/vehicle";
export const deleteVehicleApiPath = "api/admin/vehicle";
export const partRequestPath = "/api/parts";


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
  console.log("role", role)
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
export async function deleteUser(token: string, userId: string , role: string) {
  return axios.delete(
    `${adminApiPath}/manage-users/${role}/${userId}`,
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
export async function fetchAdminLogs(token: string, pageCount: number , pageSize:number) {
  const res = await fetch(`${adminApiPath}/logs/?page=${pageCount}&page_size=${pageSize}`, {
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
export async function deleteVehicle(level: string, makeId: string, token:string) {
  return axios.delete(
    `${deleteVehicleApiPath}/${level}/${makeId}`,
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

//all part requests
export async function fetchAllPartRequests() {
  const res = await fetch(`${partRequestPath}/all/part-request/`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch profiles");
  return res.json();
}


// Get Pages
export async function getAllPages() {
  const res = await fetch(`${adminApiPath}/cms/`, {
    cache: "no-store",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to vehicle makes");
  return res.json();
}

// Delete Page
export async function deletePage(pageId: string, token:string) {
  return axios.delete(
    `${adminApiPath}/cms/${pageId}`,
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
      console.error("unable to delete page", error);
      throw error;
    });
}


export async function deleteImages(pageId: string, token:string) {
  return axios.delete(
    `${adminApiPath}/cms/image/${pageId}`,
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
      console.error("unable to delete Image", error);
      throw error;
    });
}

export async function getPage(pageId: string, token: string) {
  const res = await fetch(`${adminApiPath}/cms/${pageId}`, {
    cache: "no-store",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch page details");
  return res.json();
}

// update page
export async function updatePage( pageId: string, token: string, userData: any) {

  return axios.put(
    `${adminApiPath}/cms/${pageId}`,
    { ...userData },
    {
      headers: {
        "Content-Type": "multipart/form-data",
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

// add new page
export async function addNewPage( token: string, userData: any) {

  return axios.post(
    `${adminApiPath}/cms/`,
    { ...userData },
    {
      headers: {
        "Content-Type": "multipart/form-data",
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
// upload image
export async function uploadImage( token: string, userData: any) {

  return axios.post(
    `${adminApiPath}/cms/upload-image`,
    userData ,
    {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    }
  )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("unable to update user", error);
      throw error;
    });
}

//menu get
export async function getMenuData( token: string) {
  const res = await fetch(`${adminApiPath}/cms/menu/view`, {
    cache: "no-store",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch page details");
  return res.json();
}

//menu update
export async function updateMenuData( token: string, menuData: any) {
  return axios.post(
    `${adminApiPath}/cms/menu/add`,
    { data : [...menuData] },
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }
  )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("unable to update menu", error);
      throw error;
    });
}