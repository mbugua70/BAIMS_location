import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { Notifier, NotifierComponents } from "react-native-notifier";
import {
  RefreshControl,
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Platform,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { ProjectContext } from "../store/projectContext";
import { ProjectRefetch } from "../http/api";
import { GlobalStyles } from "../Constants/Globalcolors";

import Toast from "react-native-toast-message";

//components
import CardCategoryUI from "../UI/CardCategoryUI";
import Welcome from "../components/Welcome";
import { useIsFocused } from "@react-navigation/native";
import { database } from "../models/index.android";


const Dashboard = ({ navigation }) => {
  const { projectsData, addProjects } = useContext(ProjectContext);
  const [isOffline, setIsOffline] = useState(false);
  const [isInternetReachable, setIsInternetReachable] = useState(false);
  const [userID, setUserID] = useState("")
  const [offline, setOfflineData] = useState("")
  const isFocused = useIsFocused();
  const images = {
    image1: require("../assets/image/backlog.png"),
    image2: require("../assets/image/mail.png"),
    imageOffline: require("../assets/image/cloud.png")
  };

  // mutation functionality
  const { data, mutate, isError, error, isPending } = useMutation({
    mutationFn: ProjectRefetch,
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
        const filteredProjects = data.projects.map((project) => ({
          project_id: project.project_id,
          project_title: project.project_title,
          code_name: project.code_name,
          forms: project.forms,
        }));

        addProjects(filteredProjects);
      }
    },
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
      setIsInternetReachable(state.isInternetReachable);

      if (!state.isConnected && Platform.OS !== 'web') {
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

      if (!state.isInternetReachable && Platform.OS !== 'web') {
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

  function handleDashboardNav() {
    navigation.navigate("Projects");
  }

  const getFormsOffline = async () => {
   const forms = await database.get('forms').query().fetch()
   if(forms.length !== 0) {
    setOfflineData(forms.length)
   }
   setOfflineData(0)
  }



  useEffect(() => {
   async function creatUserHandler () {
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

   }

   creatUserHandler();
     // fetch offline when it loads
   getFormsOffline()
  }, [isFocused])

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
    console.log(baID)
    mutate(baID);
  }, []);

  const badgeNumber = projectsData.length;

    useEffect(() => {
      if (error && !isPending) {
        Toast.show({
          type: "error",
          text1: "Failed to log in",
          text2: error.message,
        });
      } else if (error === "TOO_MANY_ATTEMPTS_TRY-LATER" && !isPending) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Too many attempts try later",
        });
      }
    }, [error, isPending]);

  return (
    <>
      <StatusBar hidden={true} />
      {/* welcome component */}
      <View style={styles.main}>
        <ScrollView
          contentContainerStyle={styles.screen}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isPending} onRefresh={onRefresh} />
          }>
          <Welcome />
          <View style={styles.screenContainer}>
            <CardCategoryUI
              onNavigate={handleDashboardNav}
              title='Project'
              details="Active projects"
              color='#cee8c7'
              imagename={images.image1}
              isProject={true}
              badge={badgeNumber}
            />
            <CardCategoryUI
              title='Message'
              details="messages"
              color='#aaede9'
              imagename={images.image2}
              badge='0'
            />
            {/* <CardCategoryUI
              title='Offline'
              details="forms"
              color={GlobalStyles.colors.error50}
              imagename={images.imageOffline}
              badge={offline}
            /> */}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#000",
  },
  screen: {
    flex: 1,
    backgroundColor: "#000",
  },
  screenContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
});
