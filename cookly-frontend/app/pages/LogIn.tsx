import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";

export default function LogIn() {
  const router = useRouter();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const LoginFunc = async () => {
    setErrorMessage(""); 
  
    try {
      
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials"); 
      }
  
      console.log("✅ Login successful:", data);
  
       //router.push(`/Profile/username=${data.username}`); // need to fix this once we fix profile page
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      console.error("Login failed:", errorMessage);
      setErrorMessage(errorMessage); 
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../../assets/images/cookly-logo.png")} />
      <Text style={styles.heading}>Welcome to Cookly</Text>
      
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="default"
          placeholderTextColor="#555"
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          keyboardType="default"
          placeholderTextColor="#555"
        />
      </View>

      {/* display Error Message if login fails */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={LoginFunc}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/pages/SignUp")}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
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
  errorText: { color: 'red', fontSize: 16, marginTop: 10 },
});