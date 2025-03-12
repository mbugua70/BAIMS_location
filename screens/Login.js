import { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { LoginHander, queryClient } from "../http/api";

// import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from "../store/store";
import AuthContent from "../components/AuthContent";
import CocaColaTitle from "../UI/CokeHead";
import Toast from "react-native-toast-message";
import { ProjectContext } from "../store/projectContext";

const Login = () => {
  const { authenticate, isAuthenticate } = useContext(AuthContext);
  const { addProjects, addForms, addFormInputs, addFormSelects} = useContext(ProjectContext);

  const { data, mutate, isError, error, isPending } = useMutation({
    mutationFn: LoginHander,
    // the code below will wait the request to finish before moving to another page.
    onMutate: async (data) => {
      return data;
    },

    onSuccess: (data) => {
      if (data.response == "fail") {
        Toast.show({
          type: "error",
          text1: "Log in failed",
          text2: "Incorrect phone number and password",
        });
      } else {
        const baRecord = {
          name: data.name,
          ba_id: data.ba_id
        }
        authenticate(JSON.stringify(baRecord));


        const filteredProjects = data.projects.map((project) => ({
          project_id: project.project_id,
          project_title: project.project_title,
          code_name: project.code_name,
          forms: project.forms,
        }));

        const filteredForms = data.projects.map((project) => ({
          project_id: project.project_id,
          forms: project.forms,
        }));

        const inputsFields = filteredForms.flatMap((form) => form.forms.map((form_inputs) => ({
          form_id: form_inputs.form_id,
          form_title: form_inputs.form_title,
          inputs: form_inputs.form_fields
        })));

        const selectFields = inputsFields.flatMap((formSelect) =>
          formSelect.inputs.flatMap((input) => ({
            field_id: input.field_id ? input.field_id : null,
            field_input_options: input.field_input_options ? input.field_input_options : []
          }))
        );

        addFormSelects(selectFields);
        addFormInputs(inputsFields);
        addProjects(filteredProjects);
        addForms(filteredForms);
      }
    },
  });

  function loginHandler({ name, password }) {
    mutate({ name, password });
  }

  useEffect(() => {
    if (error && !isPending) {
      Toast.show({
        type: "error",
        text1: "Failed to log in",
        text2: error.message,
      });
    } else if (error === "TOO_MANY_ATTEMPTS_TRY-LATER" && !isPending) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Too many attempts try later",
      });
    }
  }, [error, isPending]);

  return (
    <View style={styles.screen}>
      <View style={styles.cokeHeadStyle}>
        <CocaColaTitle size={24} />
      </View>
      <Text style={styles.text}>Please login in to continue.</Text>
      <AuthContent
        isPending={isPending}
        isLogin
        isAuthenticate={isAuthenticate}
        onAuthenticate={loginHandler}
        isUpdating={false}
      />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginBlock: 10,
  },

  cokeHeadStyle: {
    marginTop: 48,
    marginHorizontal: 10,
    paddingVertical: 16,
    //  justifyContent: '',
    alignItems: "flex-start",
  },
  text: {
    marginHorizontal: 26,
    paddingHorizontal: 6,
    color: "gray",
    fontSize: 16,
  },
});
