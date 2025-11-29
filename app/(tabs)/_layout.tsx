import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#a855f7',
        tabBarInactiveTintColor: '#6b7280',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'scan',
          tabBarIcon: ({ color, size }) => <Ionicons name="scan-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="program"
        options={{
          title: 'extras',
          tabBarIcon: ({ color, size }) => <Ionicons name="ellipsis-vertical" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tracker"
        options={{
          title: 'daily',
          tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-circle-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          title: 'coach',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: { backgroundColor: '#12121a', borderTopColor: '#252535', borderTopWidth: 1, height: 85, paddingBottom: 20, paddingTop: 10 },
  tabLabel: { fontSize: 11, fontWeight: '600' },
});
