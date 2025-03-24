import { QueryClientProvider } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import * as Location from "expo-location";
import * as SplashScreen from "expo-splash-screen";
import { useContext, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View, Platform } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NotifierWrapper } from "react-native-notifier";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { GlobalStyles } from "./Constants/Globalcolors";
import { AuthContextProvider } from "./store/store";
import { AuthContext } from "./store/store";
import { queryClient } from "./http/api";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withDecay,
  Easing,
  withSequence,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

// screens and components import
import Login from "./screens/Login";
import CocaColaTitle from "./UI/CokeHead";
import Home from "./screens/Home";
import Report from "./screens/Report";
import IconButton from "./UI/Icon";
import Profile from "./screens/Profile";
import EditProfile from "./screens/EditProfile";
import BackButtonIcon from "./components/BackButtonIcon";
import TabBarIcon from "./components/TabBarIcon";
import FormScreen from "./screens/FormScreen";
import Records from "./screens/Records";
import Dashboard from "./screens/Dashboard";
import ProjectContextProvider from "./store/projectContext";
import RecordEdit from "./screens/RecordEdit";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AuthStack() {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "left",
        }}>
        <Stack.Screen
          name='Login'
          component={Login}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </>
  );
}

function AuthReportStack() {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "center",
        }}>
        <Stack.Screen
          name='Home Main'
          component={AuthenticatedStack}
          options={{
            animation: "none",
            contentStyle: {
              backgroundColor: "#000000",
            },
            headerTitle: "Dashboard",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name='Forms'
          component={FormScreen}
          options={{
            animation: "none",
            headerTintColor: "#fff",
            headerStyle: {
              backgroundColor: "#000000",
            },
            contentStyle: {
              backgroundColor: "#000000",
            },
          }}
        />

        <Stack.Screen
          name='Projects'
          component={Home}
          options={{
            animation: "none",
            headerTitle: "Projects",
            headerTintColor: "#fff",
            headerStyle: {
              backgroundColor: "#000000",
            },
          }}
        />

        <Stack.Screen
          name='Report'
          component={Report}
          options={{
            animation: "none",
            contentStyle: {
              backgroundColor: "#f2f2f2",
            },
            headerTintColor: "#fff",
            headerStyle: {
              backgroundColor: "#000000",
            },
          }}
        />

        <Stack.Screen
          options={{
            animation: "none",
            headerStyle: {
              backgroundColor: GlobalStyles.colors.gray200,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerShadowVisible: false,
            headerTitleStyle: {
              color: GlobalStyles.colors.gray200,
            },
          }}
          name='Records'
          component={Records}
        />

        <Stack.Screen
          name='Record Edit'
          component={RecordEdit}
          options={{
            animation: "slide_from_bottom",
            contentStyle: { backgroundColor: "#fff" },
            presentation: "modal",
            headerStyle: { backgroundColor: "#9cacff" },
            headerBackButtonDisplayMode: "minimal",
            headerShadowVisible: false,
            headerLeft: ({ headerTintColor }) => {
              return <BackButtonIcon tintColor={headerTintColor} />;
            },
          }}
        />
      </Stack.Navigator>
    </>
  );
}

function AuthenticatedStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        animation: "shift",
        tabBarStyle: {
          height: 80,
          paddingVertical: 10,
          justifyContent: "center",
          alignItems: "center",
          shadowOpacity: 0,
          elevation: 0,
          borderTopWidth: 0,
        },
      }}>
      <Tab.Screen
        name='Dashboard'
        component={Dashboard}
        options={{
          animation: "none",
          headerTintColor: "#ffffff",
          tabBarStyle: {
            backgroundColor: "#000000",
          },
          headerStyle: {
            backgroundColor: "#000000",
          },
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  color: GlobalStyles.colors.gray300,
                  fontSize: 12,
                  marginTop: 2,
                  marginBottom: 4,
                }}>
                Dashboard
              </Text>
            );
          },
          tabBarIcon: ({ color, size, focused }) => {
            return (
              <TabBarIcon
                name='home'
                color={color}
                size={size}
                focused={focused}
              />
            );
          },
        }}
      />

      <Tab.Screen
        name='Projects'
        component={Home}
        options={{
          animation: "none",
          tabBarStyle: {
            backgroundColor: "#000000",
          },
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#000000",
          },
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  color: GlobalStyles.colors.gray300,
                  fontSize: 12,
                  marginTop: 2,
                  marginBottom: 4,
                }}>
                Projects
              </Text>
            );
          },
          tabBarIcon: ({ color, size, focused }) => {
            return (
              <TabBarIcon
                name='folder'
                color={color}
                size={size}
                focused={focused}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name='Profile'
        component={Profile}
        options={{
          animation: "none",
          tabBarStyle: {
            backgroundColor: "#000000",
          },
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#000000",
          },
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  color: GlobalStyles.colors.gray300,
                  fontSize: 12,
                  marginTop: 2,
                  marginBottom: 4,
                }}>
                Profile
              </Text>
            );
          },
          tabBarIcon: ({ color, size, focused }) => {
            return (
              <TabBarIcon
                name='person'
                color={color}
                size={size}
                focused={focused}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

function Navigation() {
  const authctx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {authctx.isAuthenticate ? <AuthReportStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

function TokenHolder() {
  const authctx = useContext(AuthContext);
  const [isAppReady, setIsAppReady] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  useEffect(() => {
    async function fetchingToken() {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        authctx.authenticate(token);
      }
      setIsAppReady(true);
    }

    fetchingToken();
  }, []);


  useEffect(() => {
    async function getLocationHandler() {

      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status) {
        authctx.addPermission(status)
      }
      // Ensure splash screen hides regardless
      SplashScreen.hide();
    }

    if (isAppReady) {
      getLocationHandler();
    }
  }, [isAppReady]);

  useEffect(() => {
  async function fetchLocationPermission() {
    const hasPermission = await locationHandler();
    console.log(hasPermission, "Location Permission Status");

    if (hasPermission) {
      // Adding permission status to context
      authctx.addPermission(hasPermission);
    }

    // Only hide the splash screen once the permission process is done
    SplashScreen.hide();
  }

  // Fetch location permission status and hide splash screen once it's ready
  if (isAppReady) {
    fetchLocationPermission();
  }
}, [isAppReady]);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotifierWrapper>
        <Navigation />
      </NotifierWrapper>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style='dark' />
      <AuthContextProvider>
        <ProjectContextProvider>
          <QueryClientProvider client={queryClient}>
            <TokenHolder />
          </QueryClientProvider>
        </ProjectContextProvider>
      </AuthContextProvider>

      <Toast />
    </>
  );
}
