import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { View, Text, StyleSheet, Platform } from "react-native";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useIsFocused } from "@react-navigation/native";
import { Avatar } from "react-native-paper";
import { Button } from "react-native-paper";
import { IconButton, MD3Colors } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../Constants/Globalcolors";
import { getIndex } from "../util/getIndex";
import { AuthContext } from "../store/store";
import { fetchRecordByDate } from "../http/api";
import { connectStorageEmulator } from "@react-native-firebase/storage";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withDecay,
} from "react-native-reanimated";

const FormItem = ({
  index,
  title,
  onNavigate,
  onNavigateRecord,
  isEvenRow,
  formID,
}) => {
  const navigation = useNavigation();
  const [recordSubmit, setRecordSubmit] = useState([]);
  const [overall, setOverall] = useState([]);
  const isFocused = useIsFocused();

  const { data, mutate, isError, error, isPending, isSuccess } = useMutation({
    mutationFn: fetchRecordByDate,
    // the code below will wait the request to finish before moving to another page.
    onMutate: async (data) => {
      return data;
    },

    onSuccess: (data) => {
      const formatData = JSON.parse(data);
      if (formatData.data.length > 0) {
        setOverall(formatData.data);
      }
    },
  });

  const styling = {
    backgroundColor: overall.length === 0 ? "#819c79" : "#fff",
    borderWidth: overall.length === 0 ? 0 : 2,
    borderColor: overall.length === 0 ? "#fff" : "#819c79",
  };

  const button = {
    mode: overall.length === 0 ? "contained-tonal" : "contained",
  };

  const iconButton = {
    mode: overall.length === 0 ? "contained-tonal" : "contained",
  };

  const titleStyling = {
    color:
      overall.length === 0
        ? GlobalStyles.colors.gray700
        : GlobalStyles.colors.gray600,
  };

  useEffect(() => {
    // button background color navigation
    async function handleToday() {
      const formattedDate = new Date().toISOString().split("T")[0];
      const token = await AsyncStorage.getItem("token");
      const fetchedUser = JSON.parse(token);
      const ba_id = fetchedUser.ba_id;

      mutate({ formattedDate, formID, ba_id });
    }
    handleToday();
  }, [isFocused]);

  return (
    <View
      style={[styles.screen, { ...styling }, isEvenRow && styles.rowReverse]}>
      <View style={styles.rowContainer}>
        <View style={styles.flexContainer}>
          <Text style={[styles.title, { ...titleStyling }]}>{title}</Text>
          <View>
            <IconButton
              containerColor={overall.length === 0 ? "#f5f5f5" : "#819c79"}
              mode={iconButton.mode}
              icon='plus'
              iconColor='#000000'
              size={20}
              onPress={onNavigate}
            />
          </View>
        </View>
        {/* records */}

        <View style={styles.flexContainerTwo}>
          {!isPending && (
            <Animated.Text
              style={styles.overalRecord}
              entering={FadeIn.duration(500)}>
              {overall.length}
            </Animated.Text>
          )}
          {isPending && (
            <ActivityIndicator
              animating={true}
              color={
                overall.length === 0 ? MD2Colors.white : MD2Colors.amberA700
              }
            />
          )}
          <Text style={styles.overall}>Overall</Text>
        </View>

        <View style={styles.buttoncontainer}>
          <View>
            <Button
              buttonColor={overall.length === 0 ? "" : "#819c79"}
              labelStyle={{ fontSize: 10, paddingVertical: 0, lineHeight: 12 }}
              style={[
                styles.button,
                Platform.OS === "web"
                  ? { width: 110, alignItems: "flex-start" }
                  : { width: 90 },
              ]}
              mode={button.mode}
              icon={() => {
                return (
                  // Platform.OS !== "web" && (
                  <Avatar.Icon
                    size={24}
                    icon='eye-circle'
                    style={styles.iconAvator}
                    color='#819c79'
                  />
                  // )
                );
              }}
              onPress={onNavigateRecord}>
              Records
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FormItem;

const styles = StyleSheet.create({
  screen: {
    flexDirection: "row",
    flex: 1,
    marginHorizontal: 8,
    marginVertical: 10,
    borderRadius: 18,
    height: 150,
  },

  rowReverse: {
    flexDirection: "row-reverse",
  },

  rowContainer: {
    rowGap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flex: 1,
  },

  title: {
    width: "70%",
    fontSize: 12,
  },

  button: {
    //  height: 30,
  },

  iconAvator: {
    backgroundColor: "#fff",
  },

  flexContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flexContainerTwo: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
  },

  overall: {
    paddingVertical: 0,
    marginVertical: 0,
    marginLeft: 6,
    fontSize: 12,
  },
  overalRecord: {
    paddingVertical: 0,
    marginVertical: 0,
    fontSize: 32,
    fontWeight: "400",
  },
});
