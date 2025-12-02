import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInLeft, 
  SlideOutLeft,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { getPremiumStatus, getUserProfile } from '../utils/userData';

const { width, height } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.8;

interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
  badge?: string;
}

const menuItems: MenuItem[] = [
  { icon: 'happy-outline', label: 'Face Scan', route: '/onboarding/face-scan' },
  { icon: 'fitness-outline', label: 'Body Scan', route: '/body-scan', badge: 'NEW' },
  { icon: 'flask-outline', label: 'My Program', route: '/peptide-plan' },
  { icon: 'time-outline', label: 'Future Me', route: '/future-me' },
  { icon: 'bar-chart-outline', label: 'Progress Tracker', route: '/(tabs)/tracker' },
  { icon: 'chatbubble-outline', label: 'AI Coach', route: '/(tabs)/coach' },
];

const settingsItems: MenuItem[] = [
  { icon: 'person-outline', label: 'Profile', route: '/profile' },
  { icon: 'notifications-outline', label: 'Notifications', route: '/profile' },
  { icon: 'help-circle-outline', label: 'Help & Support', route: '/profile' },
  { icon: 'document-text-outline', label: 'Terms & Privacy', route: '/profile' },
];

export default function SideDrawer({ visible, onClose }: SideDrawerProps) {
  const router = useRouter();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (visible) {
      getPremiumStatus().then(status => setIsPremium(status.isPremium));
    }
  }, [visible]);

  const handleNavigation = (route: string) => {
    onClose();
    setTimeout(() => router.push(route as any), 300);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Animated.View 
        entering={FadeIn.duration(200)} 
        exiting={FadeOut.duration(200)}
        style={styles.backdrop}
      >
        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      {/* Drawer */}
      <Animated.View 
        entering={SlideInLeft.duration(300).springify()}
        exiting={SlideOutLeft.duration(250)}
        style={styles.drawer}
      >
        <LinearGradient colors={['#0c1929', '#071018']} style={styles.drawerContent}>
          {/* Header */}
          <View style={styles.drawerHeader}>
            <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={styles.logoContainer}>
              <Ionicons name="eye-outline" size={32} color="white" />
            </LinearGradient>
            <View style={styles.headerText}>
              <Text style={styles.appName}>LooksMax AI</Text>
              {isPremium ? (
                <View style={styles.premiumBadge}>
                  <Ionicons name="diamond-outline" size={12} color="#fbbf24" />
                  <Text style={styles.premiumText}>Premium</Text>
                </View>
              ) : (
                <Text style={styles.freeText}>Free Plan</Text>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close-outline" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Main Menu */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Features</Text>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={styles.menuItem}
                onPress={() => handleNavigation(item.route)}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconBg}>
                  <Ionicons name={item.icon} size={20} color="#38bdf8" />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.badge && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{item.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward-outline" size={18} color="#4b5563" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Settings */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Settings</Text>
            {settingsItems.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.menuItem}
                onPress={() => handleNavigation(item.route)}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(107,114,128,0.1)' }]}>
                  <Ionicons name={item.icon} size={20} color="#6b7280" />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward-outline" size={18} color="#4b5563" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Upgrade Banner */}
          {!isPremium && (
            <TouchableOpacity 
              style={styles.upgradeBanner}
              onPress={() => handleNavigation('/paywall')}
            >
              <LinearGradient 
                colors={['#0ea5e9', '#38bdf8']} 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.upgradeGradient}
              >
                <Ionicons name="diamond-outline" size={24} color="white" />
                <View style={styles.upgradeText}>
                  <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
                  <Text style={styles.upgradeSubtitle}>Unlock all features</Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Version */}
          <Text style={styles.version}>Version 1.0.0</Text>
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)' },
  backdropTouch: { flex: 1 },
  drawer: { position: 'absolute', top: 0, left: 0, bottom: 0, width: DRAWER_WIDTH, shadowColor: '#000', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.3, shadowRadius: 20 },
  drawerContent: { flex: 1, paddingTop: 60 },
  drawerHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  logoContainer: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1, marginLeft: 14 },
  appName: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  premiumBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(251,191,36,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginTop: 4, alignSelf: 'flex-start', gap: 4 },
  premiumText: { fontSize: 11, fontWeight: '600', color: '#fbbf24' },
  freeText: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  menuSection: { paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle: { fontSize: 11, fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 12, marginBottom: 4 },
  menuIconBg: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(56,189,248,0.1)', alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: 'white', marginLeft: 14 },
  menuBadge: { backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginRight: 8 },
  menuBadgeText: { fontSize: 10, fontWeight: 'bold', color: 'white' },
  upgradeBanner: { marginHorizontal: 16, marginTop: 'auto', marginBottom: 16 },
  upgradeGradient: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16 },
  upgradeText: { flex: 1, marginLeft: 12 },
  upgradeTitle: { fontSize: 15, fontWeight: 'bold', color: 'white' },
  upgradeSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  version: { textAlign: 'center', fontSize: 11, color: '#4b5563', paddingBottom: 24 },
});
