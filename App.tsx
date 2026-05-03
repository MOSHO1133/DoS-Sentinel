import 'react-native-url-polyfill/auto';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { DataProvider } from './src/context/DataContext';
import HomeScreen           from './src/screens/HomeScreen';
import AnalyticsScreen      from './src/screens/AnalyticsScreen';
import TopIPsScreen         from './src/screens/TopIPsScreen';
import DecisionEngineScreen from './src/screens/DecisionEngineScreen';
import { C } from './src/theme/colors';

const Tab = createBottomTabNavigator();

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const ICONS: Record<string, [IconName, IconName]> = {
  Home:      ['home',          'home-outline'],
  Analytics: ['bar-chart',     'bar-chart-outline'],
  TopIPs:    ['list',          'list-outline'],
  Engine:    ['hardware-chip', 'hardware-chip-outline'],
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <DataProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarActiveTintColor:   C.blue,
              tabBarInactiveTintColor: C.muted,
              tabBarStyle: {
                backgroundColor: C.surface,
                borderTopColor:  C.border,
                borderTopWidth:  1,
                height: 62,
                paddingBottom: 10,
                paddingTop: 8,
              },
              tabBarLabelStyle: {
                fontSize: 10,
                fontWeight: '600',
                letterSpacing: 0.3,
              },
              tabBarIcon: ({ color, size, focused }) => {
                const [active, inactive] = ICONS[route.name] ?? ['help-outline', 'help-outline'];
                return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
              },
            })}
          >
            <Tab.Screen name="Home"      component={HomeScreen}           options={{ title: 'Overview' }} />
            <Tab.Screen name="Analytics" component={AnalyticsScreen}      options={{ title: 'Analytics' }} />
            <Tab.Screen name="TopIPs"    component={TopIPsScreen}         options={{ title: 'Top IPs' }} />
            <Tab.Screen name="Engine"    component={DecisionEngineScreen} options={{ title: 'Engine' }} />
          </Tab.Navigator>
        </NavigationContainer>
      </DataProvider>
    </SafeAreaProvider>
  );
}
