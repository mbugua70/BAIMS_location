import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { inputRefetch, SummaryForm } from "../http/api";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { GlobalStyles } from "../Constants/Globalcolors";
import { ProjectContext } from "../store/projectContext";
import React from "react";


import AuthContentTwo from "../components/AuthContentTwo";
import Toast from "react-native-toast-message";
import { AuthContext } from "../store/store";

const Report = ({ route }) => {
  const {addFormInputsTwo} = useContext(ProjectContext)
  const { formID, formTitle } = route.params;
  const isFocused  = useIsFocused();


  const { data, mutate, isError, error, isPending, isSuccess } = useMutation({
    mutationFn: SummaryForm,
    // the code below will wait the request to finish before moving to another page.
    // onMutate: async (data) => {
    //   return data;
    // },

    onSuccess: (data) => {
      if (data.response === "fail") {
        Toast.show({
          type: "error",
          text1: "Failed to submit",
          text2: "Failed to submit the record, please try again!",
        });
      }

      if (data.response === "success") {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Data submitted successfully!",
        });
      }
    },
  });

  async function submitHandler(record) {
    // report submission
    mutate({ record });
  }

  useEffect(() => {
   if(isFocused){
    addFormInputsTwo([])
   }
  }, [isFocused])

  useEffect(() => {
    console.log(error, "Error when submitting");
    if (error && !isPending) {
      Toast.show({
        type: "error",
        text1: "Failed to submit",
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
      <View style={styles.screen}>
        <AuthContentTwo
          isPending={isPending}
          isError={isError}
          isSuccess={isSuccess}
          onAuthenticate={submitHandler}
          formID={formID}
          formTitle={formTitle}
        />
      </View>
    </>
  );
};

export default Report;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.gray200,
  },
});
