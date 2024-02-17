import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeContainerImage: {
    flex: 1,
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "50%",
  },
  buttonOuterContainer: {
    alignItems: "center",
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    width: 250, // Sabit genişlik
    height: 50, // Sabit yükseklik
    borderRadius: 10, // Yuvarlak köşeler
    borderWidth: 2, // Kenarlık genişliği
    borderColor: '#000', // Kenarlık rengi
    overflow: 'hidden',
  },
  fillStyle: {
    position: 'absolute',
    left: 0, // Soldan başlayarak
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Dolgu rengi
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    position: "absolute",
  },
  welcomeText: {
    fontSize: 24,
    color: "black",
  },
  encryptedText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "black",
  },
  chatAppText: {
    fontSize: 22,
    color: "black",
  },
  loginContainer: {
    marginTop: 20, 
  },
  alreadyMemberText: {
    color: 'black',
    fontWeight: '300',
    fontSize: 16, 
  },
  loginText: {
    color: 'blue',
    fontSize: 16, 
    fontWeight: 'bold', 
  },
});

export default styles;
