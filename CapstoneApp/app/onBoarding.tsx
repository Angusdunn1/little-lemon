import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Onboarding = () => {
  const [firstName, setFirstName] = useState(''); // State for first name
  const [email, setEmail] = useState(''); // State for email
  const router = useRouter(); // Navigation using expo-router

  const validateInput = () => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name.');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateInput()) return; // Stop if validation fails
    // Save first name and email to AsyncStorage
    await AsyncStorage.setItem('firstName', firstName || '');
    await AsyncStorage.setItem('email', email || '');
    
    // Navigate to the profile page
    router.replace('/');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      {/* Logo and Title */}
      <View style={styles.header}>
        <Text style={styles.logo}>🍋 LITTLE LEMON</Text>
        <Text style={styles.title}>Let us get to know you</Text>
      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName} // Update state
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail} // Update state
        />
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d3d3d3', // Gray background
    paddingHorizontal: 20,
    paddingVertical: 80,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4f4f4f',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    color: '#4f4f4f',
    textAlign: 'center',
  },
  inputContainer: {
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    color: '#4f4f4f',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#4f4f4f',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#c0c0c0',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#4f4f4f',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Onboarding;

