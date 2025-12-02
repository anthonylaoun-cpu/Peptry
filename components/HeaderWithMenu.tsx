import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import SideDrawer from './SideDrawer';

interface HeaderWithMenuProps {
  title: string;
  showBack?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

export default function HeaderWithMenu({ 
  title, 
  showBack = false, 
  rightIcon,
  onRightPress 
}: HeaderWithMenuProps) {
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <>
      <View style={styles.header}>
        {showBack ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="arrow-back-outline" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setDrawerVisible(true)} style={styles.headerBtn}>
            <Ionicons name="menu-outline" size={24} color="white" />
          </TouchableOpacity>
        )}
        
        <Text style={styles.headerTitle}>{title}</Text>
        
        {rightIcon ? (
          <TouchableOpacity onPress={onRightPress} style={styles.headerBtn}>
            <Ionicons name={rightIcon} size={24} color="#6b7280" />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerBtn} />
        )}
      </View>

      <SideDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
