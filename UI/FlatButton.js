import {StyleSheet, Text, View, Pressable} from "react-native";
import React, { Children, useState } from "react";


const FlatButton = ({children, onPress, isPending}) => {
    const [isPressed, setIspressed] = useState(false);

    return(
      <View style={styles.screen}>
         <Pressable disabled={isPending} onPress={onPress} style={({pressed}) => [styles.button, pressed && styles.pressed]} hitSlop={20}>
             <Text style={styles.textButton}>{children}</Text>
         </Pressable>
      </View>
    )
}

export default FlatButton;

const styles = StyleSheet.create({
    screen: {
        borderRadius: 8,
        overflow: 'hidden',
    },

    button: {
        backgroundColor: "#819c79",
        paddingVertical: 16,
    },

    textButton: {
      textAlign: "center",
      color: "#000000",
      fontWeight: "bold",
      fontSize: 14,
    },

    pressed: {
        opacity: 0.75
    }

})