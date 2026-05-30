import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Package, Receipt, MessageCircle, Settings } from 'lucide-react-native';

import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Colors, FontSize, FontFamily } from '../constants/theme';

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main tab screens
import DashboardScreen from '../screens/main/DashboardScreen';
import ProductsScreen from '../screens/main/ProductsScreen';
import OrdersScreen from '../screens/main/OrdersScreen';
import MessagesScreen from '../screens/main/MessagesScreen';
import SettingsScreen from '../screens/main/SettingsScreen';

// Stack-only screens
import AddProductScreen from '../screens/main/AddProductScreen';
import OrderDetailScreen from '../screens/main/OrderDetailScreen';
import ChatScreen from '../screens/main/ChatScreen';
import EditProfileScreen from '../screens/main/EditProfileScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import ReviewsScreen from '../screens/main/ReviewsScreen';
import SubscriptionScreen from '../screens/main/SubscriptionScreen';
import DiscountsScreen from '../screens/main/DiscountsScreen';
import ShippingAreasScreen from '../screens/main/ShippingAreasScreen';
import PaymentMethodsScreen from '../screens/main/PaymentMethodsScreen';
import BlogsScreen from '../screens/main/BlogsScreen';
import AddBlogScreen from '../screens/main/AddBlogScreen';
import StorefrontScreen from '../screens/main/StorefrontScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.borderSoft,
          borderTopWidth: 1,
          height: 62,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: { fontSize: FontSize.xs, fontFamily: FontFamily.semibold },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color }) => <Package size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color }) => <Receipt size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color }) => <MessageCircle size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <Settings size={22} color={color} strokeWidth={2} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="Discounts" component={DiscountsScreen} />
      <Stack.Screen name="ShippingAreas" component={ShippingAreasScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="Blogs" component={BlogsScreen} />
      <Stack.Screen name="AddBlog" component={AddBlogScreen} />
      <Stack.Screen name="Storefront" component={StorefrontScreen} />
    </Stack.Navigator>
  );
}

export default function RootNavigation() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
