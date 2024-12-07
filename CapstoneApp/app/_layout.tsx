import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = false; // Simulate login state
      console.log(`Logged In Status: ${loggedIn}`);
      setIsLoggedIn(loggedIn);

      // Force navigation to the correct initial route
      if (!loggedIn) {
        router.replace('/onBoarding');
      } else {
        router.replace('/'); // Home screen
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="onBoarding" options={{ title: 'Onboarding', headerShown: false }} />
      <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
      <Stack.Screen name="profile" options={{ title: 'Profile', headerShown: true }} />
    </Stack>
  );
}

