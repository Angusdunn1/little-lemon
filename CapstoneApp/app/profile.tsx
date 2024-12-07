import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, Text,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { MaskedTextInput } from 'react-native-mask-text';
import { useRouter } from 'expo-router';

export default function Profile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [notifications, setNotifications] = useState({
    OrderStatuses: true,
    PasswordChanges: true,
    SpecialOffers: true,
    Newsletter: true,
  });

  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const storedFirstName = await AsyncStorage.getItem('firstName');
      const storedLastName = await AsyncStorage.getItem('lastName');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
      const storedNotifications = await AsyncStorage.getItem('notifications');

      setFirstName(storedFirstName || '');
      setLastName(storedLastName || '');
      setEmail(storedEmail || '');
      setPhoneNumber(storedPhoneNumber || '');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    };
    loadData();
  }, []);

  const saveChanges = async () => {
    await AsyncStorage.setItem('firstName', firstName || '');
    await AsyncStorage.setItem('lastName', lastName || '');
    await AsyncStorage.setItem('email', email || '');
    await AsyncStorage.setItem('phoneNumber', phoneNumber || '');
    await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
    console.log('Changes saved!');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const logout = async () => {
    await AsyncStorage.clear();
    router.replace('/onBoarding'); // Navigate to onboarding
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.initials}>
              {`${firstName?.[0]?.toUpperCase() || ''}${lastName?.[0]?.toUpperCase() || ''}`}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <MaskedTextInput
        style={styles.input}
        mask="(999) 999-9999"
        placeholder="Phone Number"
        keyboardType="numeric"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
    <Text style={styles.notificationPref}>Notification Preferences:</Text>
    <View>
      {Object.keys(notifications).map((key) => (
        <View key={key} style={styles.checkboxContainer}>
          <CheckBox
            title={key.replace(/([A-Z])/g, ' $1')} // Convert camelCase to readable text
            checked={notifications[key]}
            onPress={() =>
              setNotifications((prev) => ({
                ...prev,
                [key]: !prev[key], // Toggle the checkbox value
              }))
            }
            // Custom styles for the checkbox
            checkedIcon="dot-circle-o" // Example checked icon (FontAwesome style)
            uncheckedIcon="circle-o" // Example unchecked icon
            checkedColor="#F4CE14" // Custom color for checked state
            uncheckedColor="#495E57" // Custom color for unchecked state
            containerStyle={styles.checkboxContainerStyle} // Custom container style
            textStyle={styles.checkboxTextStyle} // Custom text style
          />
        </View>
      ))}
    </View >
    <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
      <Text style={styles.saveText}>Save Changes</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
      <Text style={styles.logoutText}>Log Out</Text>
    </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  initials: { fontSize: 24, color: '#fff' },
  input: { borderWidth: 1, 
    padding: 10, 
    marginBottom: 16, 
    borderRadius: 8,
  },
  checkboxContainer: {
    marginBottom: 15, // Spacing between checkboxes
  },
  checkboxContainerStyle: {
    backgroundColor: 'transparent', // Remove background
    borderWidth: 0, // Remove border
    margin: 0,
    padding: 0,
  },
  checkboxTextStyle: {
    fontSize: 16,
    color: '#333', // Dark text color
  },
  saveButton: {
    backgroundColor: '#F4CE14',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#495E57',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationPref: {
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
  },
});


