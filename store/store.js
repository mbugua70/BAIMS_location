import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
  formDateRecord: "",
  token: "",
  authenticate: (token) => {},
  isAuthenticate: false,
  logout: () => {},
  locationHandler: (pickedLocation) => {},
  pickedLocations: "",
  indexItem: "",
  isLocation: false,
  indexHandler: (index) => {},
  handleFormDateRecord: (date) => {},
  isPermissionLocation: "",
  addPermission: () => {}
});

export function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [locationStore, setLocationStore] = useState({});
  const [indexItem, setIndexItem] = useState([]);
  const [formDateRecord, setFormDateRecord] = useState("");
  const [isPermittedLocation, setIsLocationPermission] = useState("")

  function authenticate(token) {
    setAuthToken(token);
    AsyncStorage.setItem("token", token);
  }

  function locationHandler(pickedLocation) {
    setLocationStore((prev) => {
      return {
        ...prev,
        pickedLocation,
      };
    });
  }

  function indexHandler(index) {
    setIndexItem((prev) => [...prev, index]);
  }

  function addPermission(permission) {
    setIsLocationPermission(permission)
    console.log(permission, 'store perrmission')
    AsyncStorage.setItem("locationPermission", JSON.stringify(permission));
  }

  function logout() {
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("formNumbers");
    AsyncStorage.removeItem("projectsData");
    AsyncStorage.removeItem("formsData");
    AsyncStorage.removeItem("formInputData");
    AsyncStorage.removeItem("formsSelectData");
    AsyncStorage.removeItem("submittedRecord");
    setIndexItem(null);
    setAuthToken(null);
  }

  function handleFormDateRecord(date) {
    setFormDateRecord(date);
  }

  useEffect(() => {
    async function loadStoredData() {
      try {
        const locationPermission = await AsyncStorage.getItem("locationPermission");

        if (locationPermission) setIsLocationPermission(JSON.parse(locationPermission));

      } catch (error) {
        console.error("Error loading data:", error);
      }
    }

    return () => loadStoredData.remove();
  }, []);

  const value = {
    token: authToken,
    isAuthenticate: !!authToken,
    authenticate: authenticate,
    logout: logout,
    isLocation: !!locationStore,
    locationHandler: locationHandler,
    pickedLocations: locationStore,
    indexItem: indexItem,
    indexHandler: indexHandler,
    handleFormDateRecord: handleFormDateRecord,
    formDateRecord: formDateRecord,
    isPermissionLocation: isPermittedLocation,
    addPermission: addPermission
  };



  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
