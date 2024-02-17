import React, { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ChatScreen from "./src/screens/ChatScreen";
import { FIREBASE_AUTH, FIREBASE_DB } from "./firebaseConfig";
import { collection, query, onSnapshot, orderBy, doc } from 'firebase/firestore';
import 'react-native-get-random-values';
import { enableScreens } from 'react-native-screens';
import { ChatProvider } from "./src/contexts/ChatContext";
// import NotificationService from "./src/services/NotificationService"; // NotificationService'yi içe aktar

enableScreens();

export type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
  Home: undefined;
  Chat: { email: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const [initialRoute, setInitialRoute] = useState<"Welcome" | "Home">("Welcome");
  const [fontsLoaded] = useFonts({
    "Mulish-Regular": require("./assets/fonts/Mulish/Mulish-Regular.ttf"),
    "Mulish-Bold": require("./assets/fonts/Mulish/Mulish-Bold.ttf"),
    "Mulish-Black": require("./assets/fonts/Mulish/Mulish-Black.ttf"),
  });

  useEffect(() => {
    const authUnsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      if (user) {
        setInitialRoute("Home");
        listenForMessages(user.uid);
      } else {
        setInitialRoute("Welcome");
      }
    });

    return () => authUnsubscribe();
  }, []);

  const listenForMessages = (userId) => {
    const userMessagesRef = collection(FIREBASE_DB, 'messages', userId, 'userMessages');
    const q = query(userMessagesRef, orderBy('timestamp', 'desc'));

    const msgUnsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const newMessage = change.doc.data();
          console.log('Yeni Mesaj:', newMessage);
          NotificationService.showNotification('Yeni Mesaj', newMessage.content || 'Mesajınız var.'); // Bildirim göster
        }
      });
    });

    return () => msgUnsubscribe();
  };

  if (!fontsLoaded) {
    return null; // Yüklenene kadar null döndür
  }

  return (
    <ChatProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </ChatProvider>
  );
}

export default App;
