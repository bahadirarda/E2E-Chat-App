import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Button,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../firebaseConfig";
import Icon from "react-native-vector-icons/FontAwesome6";
import CryptoJS from "react-native-crypto-js";
import EmojiSelector from "react-native-emoji-selector";
import "react-native-screens";
import { useChat } from "../../contexts/ChatContext";

const ChatScreen = () => {
  const { setIsInChatScreen } = useChat();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const route = useRoute();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const secretKey = "x1234axa"; // Güçlü bir anahtar kullanın.

  useEffect(() => {
    const chatId = route.params?.chatId;
    if (chatId) {
      const messagesQuery = query(
        collection(FIREBASE_DB, "Chats", chatId, "Messages"),
        orderBy("timestamp")
      );
      const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        const loadedMessages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          message: decryptMessage(doc.data().message), // Deşifre edilen mesaj
        }));
        setMessages(loadedMessages);
      });
      // Sohbet ekranına girildiğinde
      setIsInChatScreen(true);
      return () => {
        unsubscribe();
        // Sohbet ekranından çıkıldığında
        setIsInChatScreen(false);
      };
    }
  }, [route.params?.chatId, setIsInChatScreen]);

  const encryptMessage = (plainText) => {
    return CryptoJS.AES.encrypt(plainText, secretKey).toString();
  };

  const decryptMessage = (cipherText) => {
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Decryption error:", error);
      return "[Error decrypting message]";
    }
  };

  const sendMessage = async () => {
    const chatId = route.params?.chatId;
    if (message.trim() && chatId) {
      const encryptedMessage = encryptMessage(message);
      try {
        await addDoc(collection(FIREBASE_DB, "Chats", chatId, "Messages"), {
          senderId: FIREBASE_AUTH.currentUser?.uid,
          message: encryptedMessage,
          timestamp: serverTimestamp(),
        });
        console.log(encryptedMessage, "gönderildi");
        setMessage("");
      } catch (error) {
        console.error("Failed to send encrypted message:", error);
      }
    }
  };

  const addEmoji = (emoji) => {
    setMessage(message + emoji);
    setShowEmojiPicker(false);
  };

  const renderItem = ({ item }) => {
    const isMyMessage = item.senderId === FIREBASE_AUTH.currentUser?.uid;
    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ width: "100%" }}
      />
      {showEmojiPicker && (
        <EmojiSelector
          onEmojiSelected={addEmoji}
          showSearchBar={false}
          showTabs={true}
          showHistory={true}
        />
      )}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
          <Icon name="smile" size={24} color="#075E54" />
        </TouchableOpacity>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Mesajınızı yazın"
          style={styles.textInput}
        />
        <TouchableOpacity onPress={() => message}>
          <Icon name="image" size={24} color="#075E54" />
        </TouchableOpacity>
        <TouchableOpacity onPress={sendMessage} style={styles.iconButton}>
          <Icon name="paper-plane" size={24} color="#075E54" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECE5DD",
  },
  messageContainer: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 20,
    maxWidth: "75%",
    alignSelf: "flex-start",
  },
  myMessage: {
    backgroundColor: "#DCF8C6",
    marginRight: 10,
    marginLeft: "auto",
    borderTopRightRadius: 0,
  },
  theirMessage: {
    backgroundColor: "#FFF",
    marginLeft: 10,
    marginRight: "auto",
    borderTopLeftRadius: 0,
  },
  messageText: {
    color: "#555",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#075E54",
    borderRadius: 50,
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    marginLeft: 10,
  },
  iconButton: {
    marginLeft: 10,
  },
});

export default ChatScreen;
