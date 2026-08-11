import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@/context/ThemeContext';
import { HomeScreen } from '@/screens/HomeScreen';
import { FavoritesScreen } from '@/screens/FavoritesScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { ImageDetailsScreen } from '@/screens/ImageDetailsScreen';
import { AppTabParamList, FavoritesStackParamList, HomeStackParamList } from '@/navigation/types';

const Tab = createBottomTabNavigator<AppTabParamList>();
const HomeStackNav = createNativeStackNavigator<HomeStackParamList>();
const FavoritesStackNav = createNativeStackNavigator<FavoritesStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStackNav.Navigator>
      <HomeStackNav.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStackNav.Screen name="ImageDetails" component={ImageDetailsScreen} options={{ title: 'Image Details' }} />
    </HomeStackNav.Navigator>
  );
}

function FavoritesStackNavigator() {
  return (
    <FavoritesStackNav.Navigator>
      <FavoritesStackNav.Screen name="Favorites" component={FavoritesScreen} options={{ headerShown: false }} />
      <FavoritesStackNav.Screen
        name="ImageDetails"
        component={ImageDetailsScreen}
        options={{ title: 'Image Details' }}
      />
    </FavoritesStackNav.Navigator>
  );
}

function TabIcon({ symbol, color }: { symbol: string; color: string }) {
  return <Text style={{ fontSize: 20, color }}>{symbol}</Text>;
}

export function AppTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: 'Gallery',
          tabBarIcon: ({ color }) => <TabIcon symbol="🖼️" color={color} />,
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStackNavigator}
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <TabIcon symbol="♥" color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon symbol="👤" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
