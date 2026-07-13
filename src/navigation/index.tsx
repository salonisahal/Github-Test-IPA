import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { NavigatorScreenParams } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { s } from '../theme/spacing';
import DiscoverScreen from '../screens/DiscoverScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotFoundScreen from '../screens/NotFoundScreen';

export type TabParamList = {
  Discover: undefined;
  Cart: { productId?: string } | undefined;
  Orders: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  ProductDetails: { id: string };
  NotFound: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Platform.select({ ios: 83, android: 60, default: 60 }),
          paddingBottom: Platform.select({ ios: s(7), android: s(2), default: s(2) }),
          paddingTop: s(2),
          ...Platform.select({ android: { elevation: 8 }, ios: {}, default: {} }),
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          fontFamily: 'Inter-Medium',
        },
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            Discover: 'compass',
            Cart: 'cart',
            Orders: 'receipt',
            Profile: 'person',
          };
          const iconName = iconMap[route.name] ?? 'ellipse';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          ...Platform.select({ android: { elevation: 4 }, ios: {}, default: {} }),
        },
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          fontWeight: '600',
          fontSize: 17,
          color: colors.textPrimary,
        },
        headerTintColor: colors.primary,
        headerBackTitleVisible: false,
        headerShadowVisible: true,
      }}
    >
      <Stack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Product Details' }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Not Found' }} />
    </Stack.Navigator>
  );
}
