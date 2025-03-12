import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GlobalStyles } from "../Constants/Globalcolors";
import { useNavigation } from "@react-navigation/native";


const BackButtonIcon = ({ tintColor }) => {
  const navigation = useNavigation();
  function handleBackButton() {
    navigation.goBack();
  }
  return (
      <Pressable  onPress={handleBackButton}  style={({pressed}) => [styles.buttonContainer, pressed && styles.pressed, Platform.OS === 'web' ? {marginHorizontal: 10} : ""]} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}} >
        <Ionicons name="close" size={24} color="#000000" />
      </Pressable>

  );
};

export default BackButtonIcon;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: GlobalStyles.colors.gray200,
    borderRadius: 16,
    overflow: "hidden",
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  pressed: {
    opacity: 0.25
  }

});
