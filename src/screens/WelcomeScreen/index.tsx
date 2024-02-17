import React, { useState }  from "react";
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";

const image = require("../../../assets/backgroundImage.jpg");


function WelcomeScreen() {
  const navigation = useNavigation(); // Gezinme nesnesini kullan
  const fillAnimation = useState(new Animated.Value(0))[0]; // Animasyon değeri
  const handlePressIn = () => {
    
    Animated.timing(fillAnimation, {
      toValue: 1, 
      duration: 700, 
      easing: Easing.linear,
      useNativeDriver: false, 
    }).start(({ finished }) => {
      if (finished) {
        //@ts-ignore
        navigation.navigate('Register');
      }
    });
  };

  const handlePressOut = () => {
    // Kullanıcı butonu bıraktığında dolgu animasyonunu sıfırla
    Animated.timing(fillAnimation, {
      toValue: 0, // Dolgu animasyonunu sıfırlamak için değeri 0'a ayarla
      duration: 700, // Animasyon süresi
      easing: Easing.linear, // Lineer bir geçiş efekti kullan
      useNativeDriver: false, // Native driver kullanma
    }).start();
  };

  const loginPress = () => {
    console.log("Login pressed");
    navigation.navigate('Login' as never);
  }


  const buttonFillWidth = fillAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"], // Dolgu animasyonunun genişliğini ayarla
  });

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={image} style={styles.safeContainerImage}>
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.encryptedText}>E2E Encrypted</Text>
          <Text style={styles.chatAppText}>Chat App</Text>
        </View>
        <View style={styles.buttonOuterContainer}>
          <TouchableOpacity
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.buttonContainer}
          >
            <Animated.View style={[styles.fillStyle, { width: buttonFillWidth }]} />
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <View style={styles.loginContainer}>
            <Text style={styles.alreadyMemberText}>
              Already member?{" "}
              <Text
                style={styles.loginText}
                onPress={loginPress}
              >
                Login now.
              </Text>
            </Text>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default WelcomeScreen;
