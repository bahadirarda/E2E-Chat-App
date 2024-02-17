import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  keyboardAvoidingView: {
    width: '100%',
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#000',
    textAlign: 'center', // input içeriğini merkezle
    width: '100%', // input genişliğini %100 yap
  },
  button: {
    marginTop: 20,
    backgroundColor: 'green',
    width: '80%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default styles;
