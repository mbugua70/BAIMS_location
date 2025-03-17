import NetInfo from "@react-native-community/netinfo";
import { useState, useEffect } from "react";
import { Alert, StyleSheet, View, Platform, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SummaryForm } from "../http/api";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { GlobalStyles } from "../Constants/Globalcolors";

import Toast from "react-native-toast-message";
import FormContainerTwo from "./FormContainerTwo";

function AuthContentTwo({
  isEditing,
  isLogin,
  onAuthenticate,
  formID,
  formTitle,
  isPending,
  isSuccess,
  isError,
  existingData,
}) {
  const navigation = useNavigation();
  const [isSubmiting, setIsSubmitting] = useState(false);
  const [resetForm, setResetForm] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isInternetReachable, setIsInternetReachable] = useState(false);
  const [credentialsInvalid, setCredentialsInvalid] = useState({});

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
  });

    return () => unsubscribe();
  }, []);

  async function submitHandler(credentials) {
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
    onAuthenticate(credentials);
  }

  return (
    <View style={styles.authContent}>
      <FormContainerTwo
        formTitle={formTitle}
        formID={formID}
        isEditing={isEditing}
        resetForm={resetForm}
        isSubmiting={isSubmiting}
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
        isPending={isPending}
        isSuccess={isSuccess}
        isError={isError}
        existingData={existingData}
      />
    </View>
  );
}

export default AuthContentTwo;

const styles = StyleSheet.create({
  authContent: {
    flex: 1,
    // marginTop: 48,
    paddingTop: 10,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    paddingBottom: Platform.select({ ios: 20, android: 70 }),
    // backgroundColor: Colors.primary800,
  },
});
