import React from 'react';
import { View, Text, TextInput, StyleSheet, Platform, Button, Image, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";

export default function SignIn() {

  const router = useRouter();

  const CreateFunc = () => {
      // submit function stuff here
      router.push("/pages/Profile");
    };
  
  
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require("../../assets/images/cookly-logo.png")} />
        <Text style={styles.heading}>Get Started with Cookly</Text>
        
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Username"
            keyboardType="default"
            placeholderTextColor="#555"
          />
          
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            secureTextEntry
            keyboardType="default"
            placeholderTextColor="#555"
          />
        </View>
        
        <TouchableOpacity style={styles.button} onPress={CreateFunc}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#5be37f',
  },
  image: {
    height: 180,
    width: 180,
    position: 'absolute',
    top: 60,
    borderRadius: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    position: 'absolute',
    top: 260,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  inputContainer: {
    width: '85%',
    marginTop: 320,
  },
  input: {
    height: 50,
    borderColor: '#fff',
    borderWidth: 2,
    marginBottom: 16,
    width: '100%',
    paddingLeft: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#02b33a',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: "#fff",
    textDecorationLine: "underline",
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
