import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        tabBarActiveTintColor: '#38bdf8',
        tabBarInactiveTintColor: '#6b7280',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="qr-code-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="program"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="tracker"
        options={{
          title: 'Daily',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="calendar-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          title: 'Coach',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="chatbubble-outline" size={size} color={color} />,
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
  tabBar: { backgroundColor: '#0c1929', borderTopColor: '#252535', borderTopWidth: 1, height: 85, paddingBottom: 20, paddingTop: 10 },
  tabLabel: { fontSize: 11, fontWeight: '600' },
});
