import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { signInWithEmailAndPassword } from 'firebase/auth';

const auth = FIREBASE_AUTH;

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user);
      //@ts-ignore
      navigation.navigate('Home');
    } catch (error) {
        const errorMessage = (error as Error).message; // `Error` tipine dönüştürme
        console.error("Error logging in:", errorMessage);
        Alert.alert("Login Error", errorMessage);
      }
  };
  

  

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
        </View>
        <TouchableOpacity onPress={handleSignIn} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default LoginScreen;
