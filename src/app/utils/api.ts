/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";

export const BACKEND = "https://api.autopartsxchange.co.za/8000/v1/admin";
export const adminApiPath = "/api/admin";
// API paths for LOCAL

export const authApiPath = "https://api.autopartsxchange.co.za/8001/v1";
export const imagePath = "https://api.autopartsxchange.co.za/8000/image/"; 


//export const vehicleApiPath = "http://54.80.119.79:8006/v1/vehicle";
//export const deleteVehicleApiPath = "https://api.autopartsxchange.co.za/8000/v1/admin/vehicle";
//export const partRequestPath = "/https://api.autopartsxchange.co.za/8005/v1/supplier";
//export const profiles = "http://54.80.119.79:8004/profiles";
//image path
// export const imagePath = "/api/image-proxy/" 
// //API paths for Vercel
// export const authApiPath = "/api/auth";
// export const adminApiPath = "/api/admin";
// export const vehicleApiPath = "/api/vehicle";
// export const deleteVehicleApiPath = "api/admin/vehicle";
// export const partRequestPath = "/api/parts";
 
// user profiles
export async function getDashBoard() {
  const res = await fetch(`${adminApiPath}/dashboard/view-counts`  );


  if (!res.ok) throw new Error("Failed to fetch Dashboard data");
  return res.json();
}


// update Order status
export async function updateOrderStatus( data: any) {
  return axios.put(
    
    `${adminApiPath}/orders/updatestatus`,
    data,
    {
      headers: {
        "Content-Type": "application/json",

      },
    }
  )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error("unable to update order status", error);
      throw error;
    });
}

// Get orders Details
export async function getOrdersDetails(orderId:string) {
  const res = await fetch(`${adminApiPath}/view-order-details?order_id=${orderId}`, {
    cache: "no-store",
    method: "GET",
   headers: {
        "Content-Type": "application/json",

      },
  });
  if (!res.ok) throw new Error("Failed to get orders details");
  return res.json();
}

// Get Orders
export async function getAllOrders() {
  const res = await fetch(`${adminApiPath}/order/view`, {
    cache: "no-store",
    method: "GET",
   headers: {
        "Content-Type": "application/json",
      },
  });
  if (!res.ok) throw new Error("Failed to get orders");
  return res.json();
}


// user profiles
export async function fetchUsers(role: string) {
  const res = await fetch(`${adminApiPath}/manage-users/${role}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",

    },
  });
  if (!res.ok) throw new Error("Failed to fetch profiles");
  return res.json();
}
// address fetch
// export async function getAddressbyID(role:string,id: string) {
//   const res = await fetch(`${profiles}/${role}/address/${id}`, {
//     cache: "no-store",
//     headers: {
//       "Content-Type": "application/json",
   
//     },
//   });
//   if (!res.ok) throw new Error("Failed to fetch profiles");
//   return res.json();
// }

// KYC admin page
export async function fetchUsersKyc( ) {
  const res = await fetch(`${adminApiPath}/kyc/supplier`, {
    cache: "no-store",
    method: "GET",
    headers: {
      "Content-Type": "application/json",

    },
  });
  if (!res.ok) throw new Error("Failed to fetch profiles");
  return res.json();
}
// Attachments data get 
export async function fetchKycAttachments( userId: string) {
  const res = await fetch(`${adminApiPath}/kyc/view?user_id=${userId}`, {
    cache: "no-store",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
   
    },
  });
  if (!res.ok) throw new Error("Failed to fetch profiles");
  return res.json();
}

// update KYC status
export async function updateKycUser(  userData: any) {
  return axios.patch(
    `${adminApiPath}/kyc/action`,
    { ...userData },
    {
      headers: {
        "Content-Type": "application/json",
 
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

// update user
export async function updateUser(role: string, userData: any) {
  return axios.patch(
    `${adminApiPath}/manage-users/${role}/${userData?.id}`,
    { ...userData },
    {
      headers: {
        "Content-Type": "application/json",
   
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
export async function deleteUser( userId: string , role: string) {
  return axios.delete(
    `${adminApiPath}/manage-users/${role}/${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
     
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
export async function fetchAdminLogs( pageCount: number , pageSize:number) {
  const res = await fetch(`${adminApiPath}/logs/?page=${pageCount}&page_size=${pageSize}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",

    },
  });
  if (!res.ok) throw new Error("Failed to load admin logs");
  return res.json();
}

// delete user
export async function deleteAdminLogs( logId: string) {
  return axios.delete(
    `${adminApiPath}/logs/${logId}`,
    {
      headers: {
        "Content-Type": "application/json",

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
  const res = await fetch(`${adminApiPath}/vehicle/viewall/`, {
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
    `${adminApiPath}/vehicle/${level}/${makeId}`,
    {
      headers: {
        "Content-Type": "application/json",
     
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

// // Vehicle model by make name
// export async function fetchVehicleModelByMake(makeName: string) {
//   const res = await fetch(`${vehicleApiPath}/model/${makeName}`, {
//     cache: "no-store",
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   if (!res.ok) throw new Error("Failed to vehicle model by make name");
//   return res.json();
// }

//all part requests
export async function fetchAllPartRequests() {
  const res = await fetch(`${adminApiPath}/part-request/viewall`, {
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
export async function deletePage(pageId: string) {
  return axios.delete(
    `${adminApiPath}/cms/${pageId}`,
    {
      headers: {
        "Content-Type": "application/json",
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


export async function deleteImages(pageId: string) {
  return axios.delete(
    `${adminApiPath}/cms/image/${pageId}`,
    {
      headers: {
        "Content-Type": "application/json",
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

export async function getPage(pageId: string) {
  const res = await fetch(`${adminApiPath}/cms/${pageId}`, {
    cache: "no-store",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
 
    },
  });
  if (!res.ok) throw new Error("Failed to fetch page details");
  return res.json();
}

// update page
export async function updatePage( pageId: string, userData: any) {

  return axios.put(
    `${adminApiPath}/cms/${pageId}`,
    { ...userData },
    {
      headers: {
        "Content-Type": "multipart/form-data",
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
export async function addNewPage( userData: any) {

  return axios.post(
    `${adminApiPath}/cms/`,
    { ...userData },
    {
      headers: {
        "Content-Type": "application/json",
 
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
export async function uploadImage( userData: any) {

  return axios.post(
    `${adminApiPath}/cms/upload-image`,
    userData ,
    {
      headers: {
      
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
export async function getMenuData( ) {
  const res = await fetch(`${adminApiPath}/cms/menu/view`, {
    cache: "no-store",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
     
    },
  });
  if (!res.ok) throw new Error("Failed to fetch page details");
  return res.json();
}

//menu update
export async function updateMenuData( menuData: any) {
  return axios.post(
    `${adminApiPath}/cms/menu/add`,
    { data : [...menuData] },
    {
      headers: {
        "Content-Type": "application/json",
       
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

// add Buyer 
export async function addNewUser(role: string, userData: any) {

  return axios.post(
    `${authApiPath}/auth/register`,
    { ...userData, "role": role },
    {
      headers: {
        "Content-Type": "application/json",

      },
    }
  )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error("unable to add user", error);
      throw error;
    });
}