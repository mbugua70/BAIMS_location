import { View, Text, FlatList, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import React, { useEffect, useState, memo} from "react";
import { useFocusEffect } from "@react-navigation/native";
import { GlobalStyles } from "../Constants/Globalcolors";

const RadioComponent = ({ title, data, onUpdateValue, formNumber, isSuccess, isError, valueEntered, isEditing, isInvalid}) => {
  const [selectedValue, setSelectedValue] = useState(valueEntered || "");

  function handleRadioButton({ item, index }) {
    return (
      <>
        <RadioButton.Group
          onValueChange={(newValue) => {
            setSelectedValue(newValue);
            onUpdateValue(newValue);
          }}>
          <RadioButton.Item
            labelStyle={[{ fontSize: 14 }, isInvalid && {color: GlobalStyles.colors.error500}]}
            position='leading'
            label={item.label}
            value={item.value}
            status={selectedValue === item.value ? "checked" : "unchecked"}
          />
        </RadioButton.Group>
      </>
    );
  }

    useEffect(() => {
      if(isSuccess && !isError && !isEditing){
        setSelectedValue("")
      }

    },[isSuccess, isError, isEditing])
  return (
    <>
      <Text style={styles.radioText}>
        {formNumber}.{title}
      </Text>
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.label}
          renderItem={handleRadioButton}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </>
  );
};

export default memo(RadioComponent);

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  radioText: {
    marginTop: 10,
  },
});
