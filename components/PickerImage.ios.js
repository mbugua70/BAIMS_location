globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
import { View, Text, Alert, Image, StyleSheet, Pressable } from "react-native";
import { GlobalStyles } from "../Constants/Globalcolors";
import React, { useEffect, useState } from "react";
import { utils } from "@react-native-firebase/app";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { ProgressBar, MD3Colors } from "react-native-paper";
import * as DocumentPicker from 'expo-document-picker';
import storage from "@react-native-firebase/storage";
import * as ImagePicker from "expo-image-picker";
import SecondaryButton from "./SecondaryButton";

function formatImage(image) {
  const uri = image.split("/").pop();
  return uri;
}

const PickerImage = ({ onImageHandler, imageFile, resetForm }) => {
  const [cameraPermissionInformation, requestPermission] =
    ImagePicker.useCameraPermissions();
  const [isFetchingImage, setIsFetchingImage] = useState(false);
  const [pickedImage, setPickedImaage] = useState("");
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
      setPickedImaage(uri);
      onImageHandler(uri);

      if (uri) {
        console.log(uri);
        const uriImage = formatImage(uri);
        const reference = storage().ref(`data_image_one/${formatImage(uri)}`);

        try {
          setIsUploadingFile(true);
          const uploadResponse = await reference.putFile(uri);
          setIsUploadingFile(false);
        } catch (error) {
          setIsUploadingFile(false);
          console.log(error, "error uploading file to firebase");
        }
      }
    }
    setIsFetchingImage(false);
  }

  async function handleFilePick() {
    try {
      setIsFetchingImage(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setPickedImaage(uri);
        onImageHandler(uri);

        const uriImage = formatImage(uri);
        const reference = storage().ref(`data_image_one/${formatImage(uri)}`);

        try {
          setIsUploadingFile(true);
          await reference.putFile(uri);
        } catch (error) {
          console.log(error, "error uploading file to firebase");
        } finally {
          setIsUploadingFile(false);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchingImage(false);
    }
  }

  React.useEffect(() => {}, [isFetchingImage]);

  let imageContent = (
    <Pressable
      style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1 },
        styles.emptyContainer,
      ]}
      onPress={handleFilePick}>
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
      <View style={styles.buttonContainer}>
        <SecondaryButton
          isFetchingLocation={isFetchingImage}
          icon='camera'
          onPress={handleImage}>
          Take a Picture
        </SecondaryButton>
        <SecondaryButton
          isFetchingLocation={isFetchingImage}
          icon='folder'
          onPress={handleFilePick}>
          Browse Files
        </SecondaryButton>
      </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
});