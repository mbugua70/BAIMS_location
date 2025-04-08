import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Checkbox } from 'react-native-paper';
import React, { useEffect, useState, memo} from 'react';
import { GlobalStyles } from '../Constants/Globalcolors';

const CheckboxComponent = ({
  title,
  data,
  onUpdateValue,
  formNumber,
  isSuccess,
  isError,
  valueEntered,  // Ensure default value
  isEditing,
  isInvalid
}) => {
   const [isOnchange, setIsOnchange] = useState(false)



  // Store checked state per item
  const [selectedValues, setSelectedValues] = useState({});

  function toggleCheckbox(item) {
    // Ensure the existing value is either `true` or `false` before toggling
    const newValues = {
      ...selectedValues,
      [item.label]: !selectedValues[item.label] || false, // Default to `false` before toggling
    };
    setIsOnchange(true)
    setSelectedValues(newValues);
    onUpdateValue(newValues); // Pass selected values to parent
  }

  function renderCheckbox({ item }) {
    return (
      <Checkbox.Item
        position='leading'
        labelStyle={[{ fontSize: 14 }, isInvalid && { color: GlobalStyles.colors.error500 }]}
        uncheckedColor={GlobalStyles.colors.gray800}
        label={item.label}
        status={selectedValues[item.label] ? 'checked' : 'unchecked'}
        onPress={() => toggleCheckbox(item)}
      />
    );
  }
  useEffect(() => {
    if (valueEntered && typeof valueEntered === "string" && isEditing && !isOnchange) {


      const outputs = Object.fromEntries(
        valueEntered.split(',').map(option => [option.trim(), true])
      );

      setSelectedValues(outputs);
    }
  }, [valueEntered, isEditing, isOnchange]);

  useEffect(() => {
    if (isSuccess && !isError && !isEditing) {
      setSelectedValues({});
    }
  }, [isSuccess, isError, isEditing]);

  return (
    <>
      <Text style={styles.radioText}>{formNumber}. {title}</Text>
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.label}
          renderItem={renderCheckbox}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </>
  );
};

export default memo(CheckboxComponent);

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  radioText: {
    color: GlobalStyles.colors.gray800,
    marginBottom: 4,
    marginTop: 8,
    fontSize: 14,
    paddingHorizontal: 8,
  },
});
