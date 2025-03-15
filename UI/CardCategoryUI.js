import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import ImageLogo from "./ImageLogo";
import BadgeUI from "./Badge";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withDecay,
} from "react-native-reanimated";

const CardCategoryUI = ({
  onNavigate,
  title,
  color,
  imagename,
  badge,
  isProject,
}) => {
  // animation configuration
  const isPressedOne = useSharedValue(false);

  const tap = Gesture.Tap()
  .onBegin(() => {
    isPressedOne.value = true
  })
  .onFinalize(() => {
    isPressedOne.value = false
  })


  const animateStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isPressedOne.value ? 0 : 1, {duration: 300})
  }))

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[styles.gridNavItem, animateStyle]}>
        <Pressable
          android_ripple={{ color: "#ccc" }}
          style={({ pressed }) => [
            styles.buttonContainer,
            pressed
              ? [styles.pressedButton, { backgroundColor: color }]
              : { backgroundColor: color },
          ]}
          onPress={onNavigate}>
          <View style={[styles.innerGridContainer]}>
            <ImageLogo imagename={imagename} />
            <View>
              <Text style={styles.title}>{title}</Text>
              {/* badge component */}
              <BadgeUI badgeValue={badge} projectTitle={`${title}`} />
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
};

export default CardCategoryUI;

const styles = StyleSheet.create({
  gridNavItem: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 8,
    height: 150,
    borderRadius: 8,
    elevation: 8,
    shadowRadius: 8,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },

  buttonContainer: {
    borderRadius: 8,
    flex: 1,
    height: "100%",
  },
  pressedButton: {
    opacity: Platform.OS === "android" ? 1 : 0.75,
  },

  innerGridContainer: {
    fllex: 1,
    height: "100%",
    padding: 16,
    borderRadius: 8,
    justifyContent: "space-between",
  },

  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000000",
  },
});
