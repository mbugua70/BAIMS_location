import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView,TouchableWithoutFeedback, ScrollView, Keyboard} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import React, {useState, useLayoutEffect} from 'react';

import Input from "./Input";
import FlatButton from "../UI/FlatButton";
import { GlobalStyles } from '../Constants/Globalcolors';


const FormContainer = ({ onSubmit, credentialsInvalid, isPending, name, password, isUpdating}) => {
   const [enteredName, setEnteredName] = useState(name ? name : "");
    const [enteredPassword, setEnteredPassword] = useState("");

    const isFocused = useIsFocused()
    const navigation = useNavigation();


    const {
      name: nameIsValid,
      password: passwordIsValid
    } = credentialsInvalid;

    function  updateInputValueHandler(inputType, enteredValue) {
      switch (inputType) {
        case 'name':
          setEnteredName(enteredValue);
          break;
        case 'password':
          setEnteredPassword(enteredValue);
          break;
      }
    }

    function submitHandler() {
      onSubmit({
        name: enteredName,
        password: enteredPassword
      });


      if (isUpdating && enteredName !== "") {
        // navigation.setParams(
        //    { name: enteredName, phone: enteredPhone, region: enteredRegion },
        // );
        navigation.goBack();
      }
    }

    useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => {
          return (
            <Pressable
              hitSlop={20}
              onPress={submitHandler}
              style={({ pressed }) =>
                pressed ? [styles.button, styles.pressed] : styles.button
              }>
              <Text style={styles.textButton}>Save</Text>
            </Pressable>
          );
        },
      });
    }, [navigation, submitHandler]);


  return (

     <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior='padding'
          keyboardVerticalOffset={100}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
       <ScrollView contentContainerStyle={styles.container}
          keyboardShouldPersistTaps='handled'>

       <Input
          label="Phone"
          onUpdateValue={updateInputValueHandler.bind(this, 'name')}
          value={enteredName}
          isInvalid={nameIsValid}
          icon="phone"
          keyboardType="numeric"
        />


          <Input
          label="Password"
          onUpdateValue={updateInputValueHandler.bind(this, 'password')}
          value={enteredPassword}
          isInvalid={passwordIsValid}
          icon="lock"
        />


       {/* button content */}
        <View style={styles.submitContainer}>
         {!isUpdating && !isPending &&  <FlatButton onPress={submitHandler}>
            Login
         </FlatButton>}
         {isPending &&  <ActivityIndicator size={32} animating={true} color={MD2Colors.blue700} />}
        </View>
    </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default FormContainer

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0,
    paddingTop: 20,
    flexGrow: 1,
  },

  submitContainer: {
    marginTop: 20,
  },
  textButton: {
    fontSize: 16,
    fontWeight: "400",
  },
  button: {
    margin: 2,
    width: 50,
    height: 50,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    backgroundColor: GlobalStyles.colors.primary50,
    borderRadius: 25,
    opacity: 0.75,
  },

})