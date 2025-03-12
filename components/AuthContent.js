import NetInfo from "@react-native-community/netinfo";
import { useState, useEffect } from "react";
import { Alert, StyleSheet, View, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { GlobalStyles } from "../Constants/Globalcolors";

import Swal from "sweetalert2";
import FormContainer from "./FormContainer";
import Toast from "react-native-toast-message";

function AuthContent({
  onAuthenticate,
  password,
  name,
  isPending,
  isUpdating,
}) {
  const navigation = useNavigation();
  const [isOffline, setIsOffline] = useState(false);
  const [isInternetReachable, setIsInternetReachable] = useState(false);
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    name: false,
    password: false,
  });

  useEffect(() => {
    if (Platform.OS !== "web") {
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
    }
  }, []);

  function submitHandler(credentials) {
    let { name, password } = credentials;

    name = name.trim();
    password = password.trim();

    const phoneText = name.replace(/\s+/g, "");
    const phoneRegex = /^[0-9]{7,15}$/;
    const nameIsValid = phoneRegex.test(phoneText);
    const passwordIsValid = password.length > 2;

    if (!passwordIsValid || !nameIsValid) {
      if (Platform.OS === "web") {
        Swal.fire({
          title: "Invalid input",
          text: "Please check your credentials!",
          icon: "error",
        });
        setCredentialsInvalid({
          name: !nameIsValid,
          password: !passwordIsValid,
        });
      } else {
        Alert.alert("Invalid Input", "Please check your credentials.");
        setCredentialsInvalid({
          name: !nameIsValid,
          password: !passwordIsValid,
        });
      }

      return;
    }

    if (isOffline && Platform.OS !== "web") {
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
    } else if (!isInternetReachable && Platform.OS !== "web") {
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

    onAuthenticate({ name, password });
  }

  return (
    <View
      style={[
        styles.authContent,
        Platform.OS !== "web"
          ? {
              shadowColor: "black",
              shadowOffset: { width: 1, height: 1 },
              shadowOpacity: 0.35,
              shadowRadius: 4,
            }
          : "",
      ]}>
      <FormContainer
        isPending={isPending}
        isUpdating={isUpdating}
        name={name}
        password={password}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    flex: 1,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    // backgroundColor: Colors.primary800,
    // elevation: 2,
  },
});
