import {Platform} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export async function LoginHander({ name, password }) {
  let api = Platform.OS === "web" ? "/api/login" : "https://iguru.co.ke/BAIMS/ep/login.php"

  if (!name || !password) {
    throw new Error("No username and password provided!");
  }

  const userData = {
    username: name,
    password: password,
  };

  const encodedDat = new URLSearchParams(userData).toString();


  const res = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: encodedDat,
  });

  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw {
      message: data || "Submission failed.",
      statusText: res.statusText,
      status: res.status,
    };
  }
}

// submit records
export async function SummaryForm(recordData) {
 let api = Platform.OS === 'web' ? "/api/summaryform" : "https://iguru.co.ke/BAIMS/ep/BM.php"

  const token = await AsyncStorage.getItem("token");
  const { record } = recordData;


  if (!token) {
    throw new Error("No token found in AsyncStorage.");
  }

  let user;
  try {
    user = JSON.parse(token);
  } catch (error) {
    throw new Error("Failed to parse token.");
  }

  const baID = user?.ba_id || "Unknown";

  const formData = new FormData();

  formData.append("ba_id", baID);

  Object.entries(record)
    .sort()
    .forEach(([key, value]) => {
      const lastKey = Object.keys(record)
        .filter((key) => key.startsWith("sub_"))
        .sort((a, b) => {
          const numA = parseInt(a.split("_").pop(), 10);
          const numB = parseInt(b.split("_").pop(), 10);
          return numA - numB;
        })
        .pop();

      let nextNumber = 1;

      if (lastKey) {
        const parts = lastKey.split("_");
        const lastNumber = parseInt(parts.pop(), 10);
        nextNumber = lastNumber + 1;
      }

       for(const [key, value] of Object.entries(record)){
        if (key === "imageurl") {
          const uri = value;
          const formattedImage = uri.split("/").pop();

          const imageKey = `sub_1_${nextNumber + 2}`;
          // nextNumber += 1;
          formData.append(imageKey, formattedImage);

          // Remove the original imageurl
          formData.delete("imageurl");
        } else if (key === "t_date") {
          const date = new Date(value);
          if (isNaN(date.getDate())) {
            throw new Error("Invalid date input");
          }
          const formattedDate = date.toISOString().split("T")[0];
          formData.append(key, formattedDate);
        } else if (typeof value === "object") {
          const trueKeys = Object.entries(value)
            .filter(([keyTwo, valueTwo]) => valueTwo === true)
            .map(([keyTwo]) => keyTwo);

          if (trueKeys.length > 0) {
            formData.append(key, trueKeys);
          }
        } else {
          formData.append(key, value);
        }
       }
    });

  const res = await fetch(api, {
    method: "POST",
    body: formData,
  });


  const data = await res.json(); // Handle as plain text
  if (res.ok) {
    return data;
  } else {
    throw {
      message: data || "Submission failed.",
      statusText: res.statusText,
      status: res.status,
    };
  }
}

// edit records
export async function RecordEditForm(recordData) {
  let api = Platform.OS === 'web' ? "/api/recordedit" : "https://iguru.co.ke/BAIMS/ep/UPDATE-RECORD.php"
  const token = await AsyncStorage.getItem("token");
  const { record } = recordData;

  if (!token) {
    throw new Error("No token found in AsyncStorage.");
  }

  let user;
  try {
    user = JSON.parse(token);
  } catch (error) {
    throw new Error("Failed to parse token.");
  }

  const baID = user?.ba_id || "Unknown";

  const formData = new FormData();
  formData.append("ba_id", baID);

  Object.entries(record).forEach(([key, value]) => {
    if (key === "t_date") {
      const date = new Date(value);
      if (isNaN(date.getDate())) {
        throw new Error("Invalid date input");
      }
      const formattedDate = date.toISOString().split("T")["0"];
      formData.append(key, formattedDate);
    } else if (key === "r_id") {
      formData.append("record_id", value);
    } else if (typeof value === "object") {
      const trueKeys = Object.entries(value)
        .filter(([keyTwo, valueTwo]) => valueTwo === true) // Keep only true values
        .map(([keyTwo]) => keyTwo); // Extract keys

      if (trueKeys.length > 0) {
        formData.append(key, trueKeys); // Store the array under the main key
      }
    } else {
      formData.append(key, value);
    }
  });


  const res = await fetch(api, {
    method: "POST",
    body: formData,
  });

  const data = await res.json(); // Handle as plain text

  if (res.ok) {
    return data;
  } else {
    throw {
      message: data || "Submission failed.",
      statusText: res.statusText,
      status: res.status,
    };
  }
}

export async function fetchRecordData(phone) {
  let api = Platform.OS === 'web' ? `/api/recorddata` : "https://iguru.co.ke/coke/api/REPORT.php/"
  const baPhone = {
    ba_phone: phone,
  };

  const encodedDat = new URLSearchParams(baPhone).toString();

  try {
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: encodedDat,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch package data");
    }
    const data = await response.text();

    return data;
  } catch (error) {
    console.log("Error found");
    return error;
  }
}

export async function fetchRecordByDate(requestData) {
  let api = Platform.OS === 'web' ? `/api/recordbydate` : "https://iguru.co.ke/BAIMS/ep/FORM-DATA.php"
  const { formattedDate, ba_id, formID } = requestData;
  const fetchData = {
    ba_id: ba_id,
    form_id: formID,
    filter_date: formattedDate,
  };

  const encodedData = new URLSearchParams(fetchData).toString();

  try {
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: encodedData,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch package data");
    }
    const data = await response.text();
    return data;
  } catch (error) {
    return error;
  }
}

// export filteredData

export function filterAndSetFormState(record) {
  const formState = {}; // New object to store filtered values

  Object.entries(record).forEach(([key, value]) => {
    // Only keep keys that are NOT numbers
    if (isNaN(key)) {
      formState[key] = value;
    }
  });

  return formState;
}

// project refetch
export async function ProjectRefetch(baID) {
  let api = Platform.OS === 'web' ? "/api/preject" : "https://iguru.co.ke/BAIMS/ep/PROJECTS.php"
  const userDetails = {
    ba_id: baID
  }

  const encodedDat = new URLSearchParams(userDetails).toString();

  const res = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // ✅ Ensure correct headers
    },
    body: encodedDat,
  });

  const data = await res.json(); // Handle as plain text

  if (res.ok) {
    return data;
  } else {
    throw {
      message: data || "Submission failed.",
      statusText: res.statusText,
      status: res.status,
    };
  }
}

// form refetch
export async function formRefetch(projectData) {
  let api = Platform.OS === 'web' ? "/api/form" : "https://iguru.co.ke/BAIMS/ep/FORMS.php"
  const {baID, projectName, projectID} = projectData;


  const projectDetails = {
    ba_id: baID,
    project: projectName,
    project_id: projectID
  }

  const encodedDat = new URLSearchParams(projectDetails).toString();

  const res = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: encodedDat,
  });

  const data = await res.json(); // Handle as plain text

  if (res.ok) {
    return  {...data, project_id: projectID};
  } else {
    throw {
      message: data || "Submission failed.",
      statusText: res.statusText,
      status: res.status,
    };
  }
}

// inputs refetch
export async function inputRefetchHandler(projectData) {
  let api = Platform.OS === "web" ? "/api/inputs" : "https://iguru.co.ke/BAIMS/ep/VIEW-FORM.php"
  const {baID, formID, formTitle} = projectData;

  const projectDetails = {
    ba_id: baID,
    form_id: formID,
  }

  const encodedDat = new URLSearchParams(projectDetails).toString();

  const res = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: encodedDat,
  });

  const data = await res.json(); // Handle as plain text

  if (res.ok) {
    return  {inputs: data.form_inputs, form_id: formID, form_title: formTitle};
  } else {
    throw {
      message: data || "Submission failed.",
      statusText: res.statusText,
      status: res.status,
    };
  }
}
