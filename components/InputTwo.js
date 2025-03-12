import { View, Text, TextInput, StyleSheet, Platform } from "react-native";
import { GlobalStyles } from "../Constants/Globalcolors";
import { forwardRef } from "react";

const InputTwo = forwardRef((
  {
    formNumber,
    label,
    keyboardType,
    secure,
    onUpdateValue,
    value,
    isInvalid,
    placeholder,
    onSubmitEditing,
    blurOnSubmit,
    returnKeyType
  }, ref
) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, isInvalid && styles.labelInvalid]}>{formNumber}.
        { label}
      </Text>
     <TextInput
        style={[styles.input, isInvalid && styles.inputInvalid]}
        // autoCapitalize={false}
        autoCapitalize='none'
        keyboardType={keyboardType}
        secureTextEntry={secure}
        onChangeText={onUpdateValue}
        value={value}
        placeholderTextColor={GlobalStyles.colors.gray300}
        placeholder={placeholder}
        returnKeyType={returnKeyType}
        ref={ref}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={blurOnSubmit}
      />

    </View>
  );
});

export default InputTwo;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 4,
    paddingHorizontal: 4,
  },
  label: {
    color: GlobalStyles.colors.gray700,
    marginBottom: 4,
    marginTop: 8,
    fontSize: 14,
  },
  labelInvalid: {
    color: GlobalStyles.colors.error500,
  },
  input: {
    elevation: 4,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0,
    shadowRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
    fontSize: 16,
    marginTop: 4,
  },
  inputInvalid: {
    backgroundColor: GlobalStyles.colors.error50,
  },
});
