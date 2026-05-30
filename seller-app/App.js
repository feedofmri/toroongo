import 'react-native-gesture-handler';
import React from 'react';
import { Text, TextInput, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

// Import each weight directly — bypasses the package's broken index.js (italic files missing)
const Poppins_300Light = require('@expo-google-fonts/poppins/300Light/Poppins_300Light.ttf');
const Poppins_400Regular = require('@expo-google-fonts/poppins/400Regular/Poppins_400Regular.ttf');
const Poppins_500Medium = require('@expo-google-fonts/poppins/500Medium/Poppins_500Medium.ttf');
const Poppins_600SemiBold = require('@expo-google-fonts/poppins/600SemiBold/Poppins_600SemiBold.ttf');
const Poppins_700Bold = require('@expo-google-fonts/poppins/700Bold/Poppins_700Bold.ttf');
import { AuthProvider } from './src/contexts/AuthContext';
import RootNavigation from './src/navigation';
import { Colors } from './src/constants/theme';

// Apply Poppins as the global default — matches the frontend's Poppins 300 normal weight
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = { fontFamily: 'Poppins_300Light' };
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.style = { fontFamily: 'Poppins_400Regular' };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <StatusBar style="dark" backgroundColor={Colors.white} />
            <RootNavigation />
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
