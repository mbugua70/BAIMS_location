import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Alert,
  RefreshControl,
  Button,
  Platform,
  AppState,
} from "react-native";
import { Skeleton } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { ProjectContext } from "../store/projectContext";
import { AuthContext } from "../store/store";
import { filterAndSetFormState, inputRefetchHandler } from "../http/api";
import { GlobalStyles } from "../Constants/Globalcolors";
import { useFocusEffect } from "@react-navigation/native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withDecay,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { database } from "../models";

import * as Location from "expo-location";
import * as Linking from "expo-linking";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";
import InputTwo from "./InputTwo";
import FlatButton from "../UI/FlatButton";
import DropdownComponent from "./Dropdown";
import LocationPicker from "./LocationPicker";
import RadioComponent from "./RadioComponent";
import Checkbox from "./Checkbox";
import CheckboxComponent from "./Checkbox";
import PickerImage from "./PickerImage";
import BottomSheetAuto from "../UI/BottomSheetAuto";

const AnimatedFlatlistComp =
  Platform.OS === "web" ? FlatList : Animated.FlatList;

const FormContainerTwo = ({
  isEditing,
  isSuccess,
  isError,
  formTitle,
  isLogin,
  onSubmit,
  credentialsInvalid,
  isPending,
  resetForm,
  formID,
  existingData,
}) => {
  const [formState, setFormState] = useState({});
  const {
    formInputData,
    formsSelectData,
    addFormInputs,
    addFormInputsTwo,
    formInputDataTwo,
    editedData,
  } = useContext(ProjectContext);
  const { addPermission } = useContext(AuthContext);
  const { isPermissionLocation } = useContext(AuthContext);
  const [inputs, setInputs] = useState("");
  const [errors, setErrors] = useState({});
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [isOffline, setIsOffline] = useState(false);
  const [isInternetReachable, setIsInternetReachable] = useState(false);
  const [isLoadingInputs, setIsLoadingInputs] = useState(true);
  const [locationPermissionInformation, requestPermission] =
    Location.useForegroundPermissions();
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState({})
  const [isLocationStatus, setIsLocationStatus] = useState("")

  // userRefs for input fields to be used in the form
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);
  const inputRef5 = useRef(null);
  const inputRef6 = useRef(null);
  const inputRef7 = useRef(null);
  const inputRef8 = useRef(null);
  const inputRef9 = useRef(null);
  const inputRef10 = useRef(null);
  const inputRef11 = useRef(null);
  const inputRef12 = useRef(null);
  const bottomSheetModalAutoRef = useRef(null);
  const previousPermission = useRef(null);

  useEffect(() => {

    if(isLocationStatus !== "off"){
      async function handleLocation() {
        if (isPermissionLocation === "denied") {
          bottomSheetModalAutoRef.current?.present();
        }

        if (isPermissionLocation === "granted") {
          setIsFetchingLocation(true);
          const { coords } = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          setIsFetchingLocation(false);

           const {latitude, longitude} = coords;
           if(latitude && longitude) {
              setUserLocation({lat: latitude, long: longitude})
           }
        }
      }

      handleLocation();
    }
  }, [isPermissionLocation, isLocationStatus]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
      setIsInternetReachable(state.isInternetReachable);

      if (!state.isConnected) {
        Notifier.showNotification({
          title: "Network Error",
          description: "No network access, Please check your network!",
          Component: NotifierComponents.Notification,
          componentProps: {
            imageSource: require("../assets/image/no-network.png"),
            containerStyle: { backgroundColor: GlobalStyles.colors.error500 },
            titleStyle: { color: "#fff" },
            descriptionStyle: { color: "#fff" },
          },
        });
      }

      if (!state.isInternetReachable) {
        Notifier.showNotification({
          title: "Network Error",
          description: "No internet access!",
          Component: NotifierComponents.Notification,
          componentProps: {
            imageSource: require("../assets/image/no-network.png"),
            containerStyle: { backgroundColor: GlobalStyles.colors.error500 },
            titleStyle: { color: "#fff" },
            descriptionStyle: { color: "#fff" },
          },
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const subscription = AppState.addEventListener(
        "change",
        async (nextAppState) => {
          if (nextAppState === "active") {
            const updatedPermission =
              await Location.getForegroundPermissionsAsync();

            // Prevent unnecessary updates
            if (previousPermission.current !== updatedPermission.status) {
              previousPermission.current = updatedPermission.status;
              if (
                updatedPermission.status !==
                locationPermissionInformation?.status
              ) {
                requestPermission();
              }

              if (
                updatedPermission.status === Location.PermissionStatus.GRANTED
              ) {
                bottomSheetModalAutoRef.current?.dismiss();
                addPermission(updatedPermission.status);
              }
            }
          }
        }
      );

      return () => subscription.remove();
    }, [locationPermissionInformation]) // Run only when permission info changes
  );

  // mutation functionality for refetch
  const {
    data,
    mutate: mutateRefetch,
    isError: isErrorRefetch,
    error,
    isPending: isPendingRefetching,
  } = useMutation({
    mutationFn: inputRefetchHandler,
    // the code below will wait the request to finish before moving to another page.
    onMutate: async (data) => {
      return data;
    },

    onSuccess: (data) => {
      if (data.response == "fail") {
        Toast.show({
          type: "error",
          text1: "Data refetch failed",
          text2: "Please try again!",
        });
      } else {
        let filteredArray = [];
        filteredArray.push(data);
        addFormInputsTwo(filteredArray);
      }
    },
  });

  useEffect(() => {
    if (formInputDataTwo.length > 0) {
      setIsLoadingInputs(true);
      setInputs(formInputDataTwo["0"].inputs);
      setIsLoadingInputs(false);
    }

    if (formInputDataTwo.length === 0) {
      formInputData.forEach((input) => {
        if (formID === input.form_id) {
          setIsLocationStatus(input.location_status)
          setIsLoadingInputs(true);
          setInputs(input.inputs);
          setIsLoadingInputs(false);
        }
      });
    }
  }, [formInputData, formID, formInputDataTwo]);

  function updateInputValueHandler(field_id, enteredValue) {
    setFormState((prevState) => ({
      ...prevState,
      [field_id]:
        typeof enteredValue === "object"
          ? { ...prevState[field_id], ...enteredValue } // Merge objects properly
          : enteredValue, // Otherwise, just update
    }));
  }

  function handleInputsForms({ item, index }) {
    const isInput = item.field_type === "input";
    const isCheckbox = item.field_type === "checkbox";
    const isDropdown = item.field_type === "dropdown";
    const isRadio = item.field_type === "radio";
    const isRecord = item.field_type === "auto";
    const isDate = item.field_type === "date";

    let placeholder = "Enter value";
    if (item.input_title === "Date") {
      placeholder = "Enter date e.g YYYY-MM-DD";
    } else if (item.input_title === "Date of Activation") {
      placeholder = "Enter date e.g YYYY-MM-DD";
    }

    // keybaord type
    let keyboardType = "default";
    if (item.input_title === "Date") {
      keyboardType = "default";
    } else if (item.input_title === "Date of Activation") {
      keyboardType = "default";
    } else if (item.input_title === "Ba Phone") {
      keyboardType = "phone-pad";
    } else if (item.input_title === "Phone") {
      keyboardType = "phone-pad";
    } else if (item.input_title === "Record Date") {
      keyboardType = "default";
    }

    const dataView = item.field_input_options.map((item) => ({
      label: item["0"],
      value: item.option_text,
    }));

    return (
      <>
        {/* date time picker */}
        {isDate && (
          <InputTwo
            formNumber={item.input_rank}
            label={item.input_title}
            onUpdateValue={(value) =>
              updateInputValueHandler(item.field_id, value)
            }
            value={formState[item.field_id]}
            isInvalid={errors[item.field_id]}
            placeholder='Enter date e.g YYYY-MM-DD'
            onSubmitEditing={() => inputRef2.current?.focus()}
            blurOnSubmit={false}
            returnKeyType='next'
            keyboardType={keyboardType}
          />
        )}

        {isRecord && (
          <InputTwo
            formNumber={item.input_rank}
            label={item.input_title}
            onUpdateValue={(value) =>
              updateInputValueHandler(item.field_id, value)
            }
            value={formState[item.field_id]}
            isInvalid={errors[item.field_id]}
            placeholder='Enter date e.g YYYY-MM-DD'
            onSubmitEditing={() => inputRef2.current?.focus()}
            blurOnSubmit={false}
            returnKeyType='next'
            keyboardType={keyboardType}
          />
        )}

        {isInput && (
          <InputTwo
            formNumber={item.input_rank}
            label={item.input_title}
            onUpdateValue={(value) =>
              updateInputValueHandler(item.field_id, value)
            }
            value={formState[item.field_id] || ""}
            isInvalid={errors[item.field_id]}
            placeholder={placeholder}
            onSubmitEditing={() => inputRef2.current?.focus()}
            blurOnSubmit={false}
            returnKeyType='next'
            keyboardType={keyboardType}
          />
        )}

        {isDropdown && (
          <DropdownComponent
            isInvalid={errors[item.field_id]}
            formNumber={item.input_rank}
            label={item.input_title}
            data={dataView}
            value={formState[item.field_id]}
            onUpdateValue={(value) =>
              updateInputValueHandler(item.field_id, value)
            }
            ref={inputRef7}
          />
        )}

        {isRadio && (
          <RadioComponent
            isEditing={isEditing}
            isSuccess={isSuccess}
            isError={isError}
            formNumber={item.input_rank}
            isInvalid={errors[item.field_id]}
            title={item.input_title}
            data={dataView}
            valueEntered={formState[item.field_id]}
            onUpdateValue={(value) =>
              updateInputValueHandler(item.field_id, value)
            }
          />
        )}

        {isCheckbox && (
          <CheckboxComponent
            isEditing={isEditing}
            isSuccess={isSuccess}
            isError={isError}
            formNumber={item.input_rank}
            isInvalid={errors[item.field_id]}
            title={item.input_title}
            data={dataView}
            valueEntered={formState[item.field_id]}
            onUpdateValue={(value) =>
              updateInputValueHandler(item.field_id, value)
            }
          />
        )}
      </>
    );
  }

  function takeImageHander(image) {
    setFormState((prevState) => ({
      ...prevState,
      imageurl: image, // storing the image in the form state
    }));
  }

  function takeLocationHandler(pickedLocation) {
    setFormState((prevState) => ({
      ...prevState,
      location: pickedLocation, // Store location inside formState
    }));
  }

  async function getLocationHandler() {
    setIsFetchingLocation(true);
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    setIsFetchingLocation(false);
    return {
      lat: coords.latitude,
      long: coords.longitude,
    };
  }

  function validateForm() {
    let errors = {};
    let isValid = true;

    inputs.forEach((item) => {
      const value = formState[item.field_id];

      if (!value || (Array.isArray(value) && value.length === 0)) {
        errors[item.field_id] = `${item.input_title} is required`;
        isValid = false;

        if (isEditing) {
          Toast.show({
            type: "error",
            text1: "Please check all your input values",
          });
        } else {
          Notifier.showNotification({
            title: "Invalid inputs",
            description: "Please fill in all the required inputs",
            Component: NotifierComponents.Alert,
            componentProps: {
              alertType: "error",
            },
            containerStyle: { zIndex: 999 },
          });
        }
      }
    });

    setErrors(errors); // Store errors to display feedback
    return isValid;
  }

  async function handleOpenSettingsLocation() {
    if (locationPermissionInformation.canAskAgain === false) {
      Linking.openSettings().catch(() =>
        console.log("failed to open the settings")
      );
    } else {
      const { status } = await requestPermission();
      if (status === "granted") {
        addPermission(status);
        setIsFetchingLocation(true);
        const { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setIsFetchingLocation(false);

        // location handler
      } else {
        addPermission(status);
        bottomSheetModalAutoRef.current?.dismiss();
      }
    }
  }

  async function submitHandler() {
    //  check location first
    // if (isPermissionLocation === "granted") {
    //   const { coords } = await Location.getCurrentPositionAsync({
    //     accuracy: Location.Accuracy.High,
    //   });
    //   console.log(coords, "lat and long");

      if (validateForm()) {

        console.log("offline")

        await database.write(async () => {
          await database.get('forms').create(form => {
            form.formId = formID;
            form.formData = JSON.stringify({...formState});
            form.latitude = userLocation.lat;
            form.longitude = userLocation.long;
            form.createdAt = Date.now();
            form.updatedAt = Date.now();
          });
        });

        console.log("offline finished")


        // onSubmit({
        //   ...formState,
        //   form_id: formID,
        //   input_number: inputs.length,
        //   latitude: userLocation.lat,
        //   longitude: userLocation.long,
        // });
      }
    // }
  }

  // refetch function
  const onRefresh = React.useCallback(async () => {
    const token = await AsyncStorage.getItem("token");

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

    // mutation func
    mutateRefetch({ baID, formID, formTitle });
  }, [isOffline, isInternetReachable, mutateRefetch]);

  useEffect(() => {
    if (isEditing && editedData) {
      const filteredRecord = filterAndSetFormState(editedData);

      Object.entries(filteredRecord).forEach(([key, value]) => {
        const keysName = Object.keys(filteredRecord)
          .filter((keyFil) => keyFil.startsWith("sub_"))
          .sort((a, b) => {
            const numA = parseInt(a.split("_").pop(), 10);
            const numB = parseInt(b.split("_").pop(), 10);
            return numA - numB;
          });

        const longKey = keysName[keysName.length - 1];
        const latKey = keysName[keysName.length - 2];

        if (key === longKey) {
          setLongitude(value);
        }

        if (key === latKey) {
          setLatitude(value);
        }
      });

      setFormState(filteredRecord);
    }
  }, [isEditing, inputs, isError, isSuccess, editedData]);

  useEffect(() => {
    if (!isError && isSuccess && !isEditing) {
      const resetState = {};
      inputs.forEach((item) => {
        if (item.field_type === "checkbox") {
          resetState[item.field_id] = {};
        } else if (
          item.field_type === "radio" ||
          item.field_type === "dropdown"
        ) {
          resetState[item.field_id] = null;
        } else {
          resetState[item.field_id] = "";
        }
      });
      setFormState(resetState);
    }
  }, [isError, isSuccess, inputs, isEditing, isErrorRefetch]);

  return (
    <>
      <View style={styles.screen}>
        {isLoadingInputs && Platform.OS !== "web" && (
          <>
            <Animated.View
              style={styles.screenSkeleton}
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(300)}>
              <Text style={styles.formTitle}>{formTitle}</Text>
              {/* each item container */}
              <View>
                <View style={styles.skeletonItem}>
                  <Skeleton animation='wave' width={120} height={20} />
                </View>
                <View style={styles.skeletonItem}>
                  <Skeleton animation='wave' width='100%' height={40} />
                </View>
              </View>
              <View>
                <View style={styles.skeletonItem}>
                  <Skeleton animation='wave' width={120} height={20} />
                </View>
                <View style={styles.skeletonItem}>
                  <Skeleton animation='wave' width='100%' height={40} />
                </View>
              </View>
              <View>
                <View style={styles.skeletonItem}>
                  <Skeleton animation='wave' width={120} height={20} />
                </View>
                <View style={styles.skeletonItem}>
                  <Skeleton animation='wave' width='100%' height={40} />
                </View>
              </View>
              <View>
                <View style={styles.skeletonItem}>
                  <Skeleton animation='wave' width={120} height={20} />
                </View>
                <View style={styles.skeletonItem}>
                  <Skeleton animation='wave' width='100%' height={40} />
                </View>
              </View>
              <View>
                <View style={styles.skeletonItem}>
                  <Skeleton animation='wave' width={120} height={20} />
                </View>
                <View style={styles.skeletonItem}>
                  <Skeleton animation='wave' width='100%' height={40} />
                </View>
              </View>
              <View>
                <View style={styles.skeletonItem}>
                  <Skeleton animation='wave' width={120} height={20} />
                </View>
                <View style={styles.skeletonItem}>
                  <Skeleton animation='wave' width='100%' height={40} />
                </View>
              </View>
              <View style={styles.skeletonButtonContainer}>
                <FlatButton isPending={isPending} onPress={submitHandler}>
                  SUBMIT
                </FlatButton>
              </View>
            </Animated.View>
          </>
        )}

        {!isLoadingInputs && (
          <AnimatedFlatlistComp
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            showsVerticalScrollIndicator={false}
            data={inputs}
            keyExtractor={(item) => item.field_id}
            renderItem={handleInputsForms}
            contentContainerStyle={styles.flatListContainer}
            refreshControl={
              !isEditing && (
                <RefreshControl
                  refreshing={isPendingRefetching}
                  onRefresh={onRefresh}
                  colors={["#819c79", "#32cd32", "#0000ff"]}
                  tintColor='#819c79'
                />
              )
            }
            ListHeaderComponent={() => (
              <Text style={styles.formTitle}>{formTitle}</Text>
            )}
            ListFooterComponent={() => (
              //  footer component
              <>
                {/* location picker */}

                {/* submit button */}
                <View style={styles.submitContainer}>
                  {isPending ? (
                    <ActivityIndicator
                      animating={true}
                      color={MD2Colors.lightBlueA700}
                      size='small'
                    />
                  ) : (
                    <FlatButton isPending={isPending} onPress={submitHandler}>
                      SUBMIT
                    </FlatButton>
                  )}
                </View>
              </>
            )}
          />
        )}
        <BottomSheetAuto
          ref={bottomSheetModalAutoRef}
          onAutomatically={handleOpenSettingsLocation}
        />
      </View>
    </>
  );
};

export default FormContainerTwo;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 30,
  },
  container: {
    paddingBottom: 0,
    paddingTop: 0,
    flexGrow: 1,
  },

  submitContainer: {
    marginTop: 20,
    marginBottom: 20,
  },

  flatListContainer: {
    paddingTop: 20,
  },
  screenSkeleton: {
    flex: 1,
  },

  skeletonItem: {
    marginVertical: 5,
  },

  skeletonButtonContainer: {
    marginVertical: 20,
  },
});
