import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withDecay,
  useAnimatedProps,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import React, { useEffect } from "react";

const TIME = 40;
const duration = 2000
const screenWidth = Dimensions.get("window").width;


const EmptyBox = ({ noDataText }) => {
  const offset = useSharedValue(screenWidth / 2 - 190);
  const ImageAnimated = Animated.createAnimatedComponent(Image);

  const animateEmptyBox =  useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  useEffect(() => {
    offset.value = withRepeat(
      withTiming(-offset.value, { duration, easing: Easing.linear}),
      -1,
      true
    );
  }, []);

  return (
    <Animated.View style={styles.screen} entering={FadeIn.duration(300)}>
      <View style={styles.imageContainer}>
        {/* component for image */}
        <ImageAnimated
          source={require("../assets/image/out-of-stock.png")}
          style={[styles.image, animateEmptyBox]}

        />
      </View>
      <Text style={styles.textEmpty}>{noDataText}</Text>
    </Animated.View>
  );
};

export default EmptyBox;

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  imageContainer: {
    width: 200,
    height: 200,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textEmpty: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});
