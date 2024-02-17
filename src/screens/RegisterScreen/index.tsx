import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB} from '../../../firebaseConfig';


function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignUp = () => {
    createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
      .then((userCredential) => {
        console.log("User registered:", userCredential.user);

        // Firestore'da kullanıcı profil dokümanı oluştur
        const userRef = doc(FIREBASE_DB, `Users/${userCredential.user.uid}`);
        setDoc(userRef, {
          name: name,
          email: email,
          createdAt: new Date(),
        }).then(() => {
          Alert.alert("Success", "User registered and profile created.");
          navigation.navigate('Home');
        }).catch((error) => {
          console.error("Error creating user profile:", error);
          Alert.alert("Error", "There was an issue creating the user profile.");
        });
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        Alert.alert("Registration Error", error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
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
        <TouchableOpacity onPress={handleSignUp} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default RegisterScreen;
