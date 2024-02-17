import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  query,
  onSnapshot,
  doc,
  deleteDoc,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../firebaseConfig";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SwipeListView } from "react-native-swipe-list-view";

const HomeScreen = () => {
  const [chats, setChats] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [emailToAdd, setEmailToAdd] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const currentUser = FIREBASE_AUTH.currentUser;
    if (currentUser) {
      const chatsQuery = query(
        collection(FIREBASE_DB, "Chats"),
        where("participants", "array-contains", currentUser.uid)
      );
      const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
        const chatsArray = [];
        querySnapshot.forEach((doc) => {
          // Burada her bir sohbet için benzersiz bir key değeri sağlanıyor
          if (!chatsArray.some((chat) => chat.key === doc.id)) {
            chatsArray.push({
              key: doc.id,
              ...doc.data(),
            });
          }
        });
        setChats(chatsArray);
      });

      return () => unsubscribe();
    }
  }, []);

  const addContactAndChat = async () => {
    if (!emailToAdd) {
        Alert.alert("Error", "Please enter an email address.");
        return;
    }

    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) {
        Alert.alert("Error", "No current user found.");
        return;
    }

    // Find the user to add by email
    const usersRef = collection(FIREBASE_DB, "Users");
    const q = query(usersRef, where("email", "==", emailToAdd));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        Alert.alert("Error", "User not found.");
        return;
    }

    const userToAddId = querySnapshot.docs[0].id;

    // Check if there's a mutual chat request or create a new one
    const chatRequestsRef = collection(FIREBASE_DB, "ChatRequests");
    const existingRequestQuery = query(chatRequestsRef, where("senderId", "==", currentUser.uid), where("receiverId", "==", userToAddId));
    const existingRequestSnapshot = await getDocs(existingRequestQuery);

    if (!existingRequestSnapshot.empty) {
        Alert.alert("Info", "Chat request already sent.");
        return;
    }

    // Check for an existing request from the other user to the current user
    const reverseRequestQuery = query(chatRequestsRef, where("senderId", "==", userToAddId), where("receiverId", "==", currentUser.uid));
    const reverseRequestSnapshot = await getDocs(reverseRequestQuery);

    if (!reverseRequestSnapshot.empty) {
        // Mutual interest confirmed, create a chat
        const chatRef = collection(FIREBASE_DB, "Chats");
        const newChatDoc = await addDoc(chatRef, {
            participants: [currentUser.uid, userToAddId],
            timestamp: serverTimestamp(),
        });

        // Optionally, delete the chat requests as they are no longer needed
        await Promise.all(reverseRequestSnapshot.docs.map(doc => deleteDoc(doc.ref)));

        Alert.alert("Success", "Chat created successfully.");
    } else {
        // No mutual interest yet, create a new chat request
        await addDoc(chatRequestsRef, {
            senderId: currentUser.uid,
            receiverId: userToAddId,
            timestamp: serverTimestamp(),
        });
        console.log(userToAddId.email, "eklendi.");
        Alert.alert("Success", "Chat request sent.");
    }

    setEmailToAdd('');
    setModalVisible(false);
};
  const deleteChat = async (chatId) => {
    Alert.alert("Delete Chat", "Are you sure you want to delete this chat?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          await deleteDoc(doc(FIREBASE_DB, "Chats", chatId));
          setChats((prevChats) =>
            prevChats.filter((chat) => chat.key !== chatId)
          );
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate("Chat", { chatId: item.key })}
    >
      <Text style={styles.chatTitle}>Chat ID: {item.key}</Text>
    </TouchableOpacity>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn]}
        onPress={() => deleteChat(data.item.key)}
      >
        <Icon name='delete' style={styles.deleteButton}></Icon>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SwipeListView
        data={chats}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        disableRightSwipe
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="Enter email address"
              value={emailToAdd}
              onChangeText={setEmailToAdd}
              style={styles.modalTextInput}
            />
            <Button title="Add" onPress={addContactAndChat} />
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="person-add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEDED",
  },
  itemContainer: {
    backgroundColor: "white",
    padding: 20,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chatTitle: {
    fontSize: 18,
    color: "#555",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 75,
    backgroundColor: "red",
    right: 0,
  },
  deleteButton: {
    color: "#FFF",
    fontSize: 30,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#25D366",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  addButtonText: {
    fontSize: 24,
    color: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTextInput: {
    height: 40,
    width: "80%",
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingLeft: 10,
  },
});

export default HomeScreen;
