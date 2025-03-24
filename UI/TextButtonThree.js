import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";

const TextButtonThree = ({ children, onPress, textStyling, buttonStyling }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [buttonStyling, pressed && styles.pressed]}>
      <Text style={[textStyling]}>{children}</Text>
    </Pressable>
  );
};

export default TextButtonThree;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
});
