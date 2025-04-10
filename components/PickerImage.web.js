globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
import { View, Text, Alert, Image, StyleSheet, Pressable } from "react-native";
import { GlobalStyles } from "../Constants/Globalcolors";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { ProgressBar, MD3Colors } from "react-native-paper";

// Firebase Web SDK imports for app initialization and storage usage
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";

// Your Firebase web configuration
const firebaseConfig = {
  apiKey: "AIzaSyDg848NQSkJZOK0vpuCSd7NvVT4-77Y2Ww",
  authDomain: "dataappfiles.firebaseapp.com",
  projectId: "dataappfiles",
  storageBucket: "dataappfiles.firebasestorage.app",
  messagingSenderId: "680149928267",
  appId: "1:680149928267:web:3f3817553d982ab8f700ce",
  measurementId: "G-F2GX09GSC6",
};

// Initialize Firebase and get a storage instance
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

import * as ImagePicker from "expo-image-picker";
import SecondaryButton from "./SecondaryButton";

// Helper function to format and extract a file name from a URI
function formatImage(image) {
  const uri = image.split("/").pop();
  return uri;
}

const PickerImage = ({ onImageHandler, imageFile, resetForm }) => {
  const [cameraPermissionInformation, requestPermission] =
    ImagePicker.useCameraPermissions();
  const [isFetchingImage, setIsFetchingImage] = useState(false);
  const [pickedImage, setPickedImage] = useState(""); // renamed variable for clarity
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [reference, setReference] = useState({});
  const [isImagePicked, setIsImagePicked] = useState(false);

  async function verifyCameraPermission() {
    if (
      cameraPermissionInformation.status ===
      ImagePicker.PermissionStatus.UNDETERMINED
    ) {
      const iosPermission = await requestPermission();
      return iosPermission.granted;
    }

    if (
      cameraPermissionInformation.status === ImagePicker.PermissionStatus.DENIED
    ) {
      Alert.alert(
        "Denied Camera Permission",
        "You need to accept camera permission to continue"
      );
      return false;
    }
    return true;
  }

  async function handleImage() {
    const isPermission = await verifyCameraPermission();
    if (!isPermission) {
      return;
    }
    setIsFetchingImage(true);

    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!image.canceled) {
      const uri = image.assets[0].uri;
      setPickedImage(uri);
      onImageHandler(uri);

      if (uri) {
        console.log(uri);
        // Create a storage reference with the file name
        const storageRef = ref(storage, `data_image_one/${formatImage(uri)}`);

        try {
          setIsUploadingFile(true);
          // Fetch the file at the URI and convert it to a Blob
          const response = await fetch(uri);
          const blob = await response.blob();

          // Upload the blob to Firebase Storage
          const uploadResponse = await uploadBytes(storageRef, blob);
          console.log("Uploaded file!", uploadResponse);
          setIsUploadingFile(false);
        } catch (error) {
          setIsUploadingFile(false);
          console.log(error, "error uploading file to firebase");
        }
      }
    }
    setIsFetchingImage(false);
  }

  useEffect(() => {}, [isFetchingImage]);

  // Display a preview image or an upload prompt
  let imageContent = (
    <Pressable
      style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1 },
        styles.emptyContainer,
      ]}
      onPress={handleImage}
    >
      <Image
        source={require("../assets/image/upload.png")}
        style={styles.uploadImage}
      />
      <Text>Upload your file</Text>
    </Pressable>
  );

  if (imageFile && !isFetchingImage) {
    imageContent = <Image style={styles.image} source={{ uri: imageFile }} />;
  }

  return (
    <View>
      <View style={styles.imageContainer}>{imageContent}</View>
      <SecondaryButton
        isFetchingLocation={isFetchingImage}
        icon="camera"
        onPress={handleImage}
      >
        Take a Picture
      </SecondaryButton>
    </View>
  );
};

export default PickerImage;

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e9e5fb",
    marginVertical: 18,
    borderColor: GlobalStyles.colors.gray700,
    borderStyle: "dashed",
    borderWidth: 2,
    borderRadius: 12,
  },

  textfallback: {
    textAlign: "center",
    color: "#fff",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  emptyContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadImage: {
    width: 100,
    height: 100,
  },
});
