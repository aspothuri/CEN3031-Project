import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, Button, Image, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";

export default function SignUp() { // was called signin before which was a little miss leading

  const router = useRouter();


  //handles the state of the input fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  //api call to the signup
  const CreateFunc = async () => {
    setErrorMessage(""); // clear old errors. yes, it just printed the old errors without this

    try {
      console.log(" Attempting signup...");

      const response = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed. Try again."); 
      }

      console.log("✅ Signup successful!", data);
      //router.push(`/Profile?username=${username}`); // need to fix this once we fix profile page
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      console.error("🚨 Signup failed:", errorMessage);
      setErrorMessage(errorMessage); 
    }
  };
  


    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require("../../assets/images/cookly-logo.png")} />
        <Text style={styles.heading}>Get Started with Cookly</Text>
        
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            keyboardType="default"
            placeholderTextColor="#555"
          />
          <TextInput 
          style={styles.input} 
          placeholder="Email"
          value={email}
          onChangeText={setEmail} //didn't have an email feild before
          keyboardType="email-address"
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
        
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
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
  errorText: { color: 'red', fontSize: 16, marginTop: 10 }, 
});
