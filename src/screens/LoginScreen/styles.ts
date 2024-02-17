import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Arka plan rengi
  },
  keyboardAvoidingView: {
    width: '100%', // Ekranın genişliğini kaplar
  },
  inputContainer: {
    width: '80%', // Giriş alanlarının genişliği
    alignSelf: 'center',
  },
  input: {
    backgroundColor: 'white', // Giriş alanlarının arka plan rengi
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#cccccc', // Çerçeve rengi
    textAlign: "center",
  },
  button: {
    backgroundColor: '#007bff', // Butonun arka plan rengi
    width: '80%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white', // Buton metin rengi
    fontWeight: 'bold',
  },
});

export default styles;
