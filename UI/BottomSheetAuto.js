import * as SplashScreen from "expo-splash-screen";

import React, { forwardRef, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";


import TransactionComponent from "./TransactionComponent";
import TextButtonThree from "./TextButtonThree";
import { GlobalStyles } from "../Constants/Globalcolors";

const BottomSheetAuto = forwardRef(({ onAutomatically }, ref) => {

  const snapPoints = [500];

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  // renders
  return (
    <BottomSheetModal
      snapPoints={snapPoints}
      ref={ref}
      onChange={handleSheetChanges}
      backdropComponent={({ style }) => (
        <View
          style={[
            style,
            {
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
            },
          ]}
        />
      )}

      //   enableHandlePanningGesture={false}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.containerHolder}>
          {/* image  */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/image/location.png")}
              style={styles.image}
            />
          </View>
          {/* title / heading */}
          {/* description */}
          <View style={styles.textContainer}>
            <Text style={styles.headerDetails}>Where are you?</Text>
            <Text style={styles.details}>
              Set your location so that we can locate Gym near you, Or get the
              direction of the Gym for you.
            </Text>
          </View>
          {/* button */}
          <TextButtonThree
            onPress={onAutomatically}
            textStyling={{ fontSize: 16, color: "#fff" }}
            buttonStyling={{
              backgroundColor: GlobalStyles.colors.main700,
              width: "80%",
              paddingVertical: 12,
              paddingHorizontal: 8,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 18,
              marginTop: 0,
            }}>
            Set automatically
          </TextButtonThree>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
const styles = StyleSheet.create({
  contentContainer: {
    height: 500,
  },
  containerHolder: {
    margin: 0,
    padding: 0,
    height: 500,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
    height: 140,
  },
  title: {
    textTransform: "capitalize",
  },
  flexContainer: {
    paddingHorizontal: 14,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
  },
  imageContainer: {
    width: "100%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  textContainer: {
    paddingVertical: 20,
    width: "100%",
    alignItems: "center",
  },
  headerDetails: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  details: {
    textAlign: "center",
    color: GlobalStyles.colors.gray500,
    fontSize: 16,
    marginBottom: 5,
  },
});

export default BottomSheetAuto;
