import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import Animated, {FadeIn, FadeOut} from "react-native-reanimated";
import ImageLogo from "./ImageLogo";
import BadgeUI from "./Badge";

const CardCategoryUI = ({
  onNavigate,
  title,
  color,
  imagename,
  badge,
  isProject,
}) => {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.gridNavItem}>
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
