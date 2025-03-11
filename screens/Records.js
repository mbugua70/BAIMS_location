import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { GlobalStyles } from "../Constants/Globalcolors";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { fetchRecordByDate } from "../http/api";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { ProjectContext } from "../store/projectContext";

import DateTimePicker from "@react-native-community/datetimepicker";
import ButtonText from "../UI/ButtonText";
import Toast from "react-native-toast-message";
import RecordContainer from "../components/RecordContainer";
import EmptyBox from "../UI/EmptyBox";
import { handleNewtwork } from "../Network";
import { AuthContext } from "../store/store";

const Records = ({ route }) => {
  const { addRecords, records } = useContext(ProjectContext);
  const { handleFormDateRecord, formDateRecord } = useContext(AuthContext);
  const [activeButton, setActiveButton] = useState(1);
  const [userData, setUserData] = useState("");
  const [isOffline, setIsOffline] = useState(false);
  const [isInternetReachable, setIsInternetReachable] = useState(false);
  const [pickerdate, setPickerDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isFetchingUserData, setIsFetchingUserData] = useState(true);
  const [networkText, setNetworkText] = useState("");
  const isFocused = useIsFocused();

  const { formID, formTitle } = route.params;

  useEffect(() => {
    async function handleToken() {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setUserData(JSON.parse(token));
        setIsFetchingUserData(false);
      }
      setIsFetchingUserData(false);
    }

    handleToken();
  }, [isFocused]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isConnected = state.isConnected;
      const isReachable = state.isInternetReachable ?? false;

      setIsOffline(!state.isConnected);
      setIsInternetReachable(state.isInternetReachable ?? false);

      if (!isConnected) {
        setNetworkText("Something went wrong, Please try again!");
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
      } else {
        setNetworkText("");
      }

      if (!isReachable) {
        setNetworkText("Something went wrong, Please try again!");
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
      } else {
        setNetworkText("");
      }
    });

    return () => unsubscribe();
  }, []);

  const buttonStyle = {
    buttonOne: {
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      borderTopWidth: 3,
      borderBottomWidth: 3,
      borderLeftWidth: 3,
      borderRightWidth: 0,
    },
    buttonTwo: {
      borderTopWidth: 3,
      borderBottomWidth: 3,
      borderLeftWidth: 3,
      borderRightWidth: 0,
    },
    buttonThree: {
      borderTopWidth: 3,
      borderBottomWidth: 3,
      borderLeftWidth: 3,
      borderRightWidth: 3,
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
    },
  };

  const { data, mutate, isError, error, isPending, isSuccess } = useMutation({
    mutationFn: fetchRecordByDate,
    // the code below will wait the request to finish before moving to another page.
    onMutate: async (data) => {
      return data;
    },

    onSuccess: (data) => {
      const formatData = JSON.parse(data);
      if (formatData) {
        addRecords(formatData.data);
        handleFormDateRecord(formatData.date);
      }
    },
  });

  // button background color navigation
  async function handleToday() {
    setActiveButton(1);
    const formattedDate = new Date().toISOString().split("T")[0];
    const token = await AsyncStorage.getItem("token");
    const fetchedUser = JSON.parse(token);
    const ba_id = fetchedUser.ba_id;

    const isNetwork = await handleNewtwork();
    console.log(isNetwork, "net");

    if (isNetwork) {
      if (isNetwork.isConnected && isNetwork.isInternetReachable) {
        mutate({ formattedDate, formID, ba_id });
      }

      if (isNetwork.isConnected === false) {
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

      if (isNetwork.isInternetReachable === false) {
        Notifier.showNotification({
          title: "Network Error",
          description: "No internet access, Please check your internet!",
          Component: NotifierComponents.Notification,
          componentProps: {
            imageSource: require("../assets/image/no-network.png"),
            containerStyle: { backgroundColor: GlobalStyles.colors.error500 },
            titleStyle: { color: "#fff" },
            descriptionStyle: { color: "#fff" },
          },
        });
      }
    }
  }

  function handleYesterday() {
    setActiveButton(2);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // formatting
    const formattedDate = yesterday.toISOString().split("T")[0];
    const ba_id = userData.ba_id;

    if (isOffline) {
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
      return;
    } else if (!isInternetReachable) {
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
      return;
    }

    mutate({ formattedDate, formID, ba_id });
  }

  const openDatePicker = () => {
    setTempDate(pickerdate);
    setShowPicker(true);
  };

  const onChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      // User pressed "Cancel"
      setShowPicker(false);
      return;
    }

    if (selectedDate) {
      setPickerDate(selectedDate);
      setShowPicker(false); // Close after selection
      handleDateBackend(selectedDate);
    }
  };

  function handleDate() {
    setActiveButton(3);
    // triggering the modal date to open
    addRecords([]);
    openDatePicker();
  }

  function handleDateBackend(selectedDate) {
    const ba_id = userData.ba_id;

    if (isOffline) {
      Notifier.showNotification({
        title: "Network Error",
        description: "No network Íaccess, Please check your network!",
        Component: NotifierComponents.Notification,
        componentProps: {
          imageSource: require("../assets/image/no-network.png"),
          containerStyle: { backgroundColor: GlobalStyles.colors.error500 },
          titleStyle: { color: "#fff" },
          descriptionStyle: { color: "#fff" },
        },
      });
      return;
    } else if (!isInternetReachable) {
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
      return;
    }

    if (pickerdate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      mutate({ formattedDate, formID, ba_id });
    } else {
      Toast.show({
        type: "error",
        text1: "Date error",
        text2: "Failed to pick date",
      });
    }
  }

  // renderrecord item
  function handleRecordItem({ item, index }) {
    return (
      <>
        <RecordContainer
          formID={formID}
          formTitle={formTitle}
          index={index}
          item={item}
        />
      </>
    );
  }

  let content;

  if (isSuccess && !isError && !isPending) {
    const fetchedData = JSON.parse(data);
    if (fetchedData.data.length === 0) {
      content = <EmptyBox noDataText='You have no records to show!' />;
    } else {
      content = (
        <FlatList
          data={records}
          keyExtractor={(item) => item.r_id}
          renderItem={handleRecordItem}
          contentContainerStyle={[
            styles.flatListContainer,
            Platform.OS === "android" && { paddingBottom: 50 },
          ]}
        />
      );
    }
  }

  if (
    networkText !== "" &&
    networkText !== null &&
    networkText === "Something went wrong, Please try again!" &&
    !isFetchingUserData
  ) {
    content = (
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/image/thinking.png")}
          style={styles.image}
        />
        <Text style={styles.imageText}>
          Something went wrong, Please try again!
        </Text>
      </View>
    );
  }

  useEffect(() => {
    setTimeout(async () => {
      await handleToday();
    }, 500);
  }, []);

  return (
    <>
      <View style={styles.screen}>
        {/* header title */}
        <Text style={styles.headerTitle}>Records</Text>

        {/* button text */}
        <View style={styles.buttonContainer}>
          <ButtonText
            isActive={1}
            activeButton={activeButton}
            onPress={handleToday}
            borderWidth={buttonStyle.buttonOne}>
            Today
          </ButtonText>
          <ButtonText
            isActive={2}
            activeButton={activeButton}
            onPress={handleYesterday}
            borderWidth={buttonStyle.buttonTwo}>
            Yesterday
          </ButtonText>
          <ButtonText
            isActive={3}
            activeButton={activeButton}
            onPress={handleDate}
            borderWidth={buttonStyle.buttonThree}>
            Date
          </ButtonText>
        </View>

        {showPicker && (
          <DateTimePicker
            value={pickerdate}
            mode='date'
            display={Platform.OS === "ios" ? "spinner" : "calendar"}
            onChange={onChange}
          />
        )}

        {/* showing empty box incase no data is available */}

        {content}
        {/* dashboard  showing the records*/}
      </View>
      {isPending && !isOffline && (
        <View style={styles.overlayLoading}>
          <ActivityIndicator
            size={32}
            animating={true}
            color={MD2Colors.lightBlueA700}
          />
        </View>
      )}
    </>
  );
};

export default Records;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: GlobalStyles.colors.gray200,
    flex: 1,
  },
  headerTitle: {
    marginHorizontal: 20,
    fontSize: 20,
    fontWeight: "600",
  },
  buttonContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    flexDirection: "row",
  },
  overlayLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#000000",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
  },
  flatListContainer: {
    marginTop: 20,
    paddingBottom: 20,
  },

  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    rowGap: 20,
    padding: 20,
  },
  image: {
    width: 82,
    height: 82,
  },
  imageText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
