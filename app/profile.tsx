import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { getUserProfile, getPremiumStatus, getScanHistory, clearAllUserData } from '../utils/userData';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const [isPremium, setIsPremium] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [memberSince, setMemberSince] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [premium, history, profile] = await Promise.all([
      getPremiumStatus(),
      getScanHistory(),
      getUserProfile(),
    ]);
    setIsPremium(premium.isPremium);
    setScanCount(history.length);
    if (profile?.createdAt) {
      setMemberSince(new Date(profile.createdAt).toLocaleDateString());
    } else {
      setMemberSince(new Date().toLocaleDateString());
    }
  };

  const handleLogout = async () => {
    await clearAllUserData();
    router.replace('/');
  };

  return (
    <LinearGradient colors={['#071018', '#0c1929', '#071018']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.avatarSection}>
          <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={styles.avatar}>
            <Ionicons name="person-outline" size={48} color="white" />
          </LinearGradient>
          {isPremium && (
            <View style={styles.premiumBadge}>
              <Ionicons name="diamond-outline" size={14} color="#fbbf24" />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
          <Text style={styles.memberText}>Member since {memberSince}</Text>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{scanCount}</Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{isPremium ? '∞' : '0'}</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
        </Animated.View>

        {/* Settings List */}
        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="notifications-outline" size={22} color="#38bdf8" />
            </View>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#4b5563" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#22c55e" />
            </View>
            <Text style={styles.settingLabel}>Privacy</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#4b5563" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="help-circle-outline" size={22} color="#3b82f6" />
            </View>
            <Text style={styles.settingLabel}>Help & Support</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#4b5563" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="document-text-outline" size={22} color="#f97316" />
            </View>
            <Text style={styles.settingLabel}>Terms & Privacy Policy</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#4b5563" />
          </TouchableOpacity>
        </Animated.View>

        {/* Premium CTA */}
        {!isPremium && (
          <Animated.View entering={FadeInUp.delay(400).springify()}>
            <TouchableOpacity onPress={() => router.push('/paywall')}>
              <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={styles.premiumCta}>
                <Ionicons name="diamond-outline" size={24} color="white" />
                <View style={styles.premiumCtaText}>
                  <Text style={styles.premiumCtaTitle}>Upgrade to Premium</Text>
                  <Text style={styles.premiumCtaSubtitle}>Unlock all features</Text>
                </View>
                <Ionicons name="arrow-forward-outline" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Logout */}
        <Animated.View entering={FadeInUp.delay(500).springify()}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Reset App Data</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  premiumBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(251,191,36,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6, marginBottom: 8 },
  premiumText: { color: '#fbbf24', fontWeight: '600', fontSize: 13 },
  memberText: { color: '#6b7280', fontSize: 13 },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 20, marginBottom: 24 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  statLabel: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  settingsCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, marginBottom: 24 },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  settingIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, color: 'white', fontSize: 15, marginLeft: 14 },
  premiumCta: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, marginBottom: 24, gap: 12 },
  premiumCtaText: { flex: 1 },
  premiumCtaTitle: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  premiumCtaSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 12 },
  logoutText: { color: '#ef4444', fontWeight: '600' },
  version: { textAlign: 'center', color: '#4b5563', fontSize: 12, marginTop: 24 },
});
