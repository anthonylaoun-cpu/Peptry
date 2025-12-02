import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User { name: string; email: string; }

export default function DashboardScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadUser();
    checkPremium();
  }, []);

  const loadUser = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    else router.replace('/');
  };

  const checkPremium = async () => {
    const premium = await AsyncStorage.getItem('isPremium');
    setIsPremium(premium === 'true');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    router.replace('/');
  };

  return (
    <LinearGradient colors={['#071018', '#0c1929', '#071018']} style={styles.container}>
      <ScrollView style={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={styles.headerLogo}>
              <Ionicons name="eye-outline" size={20} color="white" />
            </LinearGradient>
            <Text style={styles.headerTitle}>LooksMax AI</Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Welcome */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.welcome}>
          <Text style={styles.welcomeTitle}>
            Welcome, <Text style={styles.welcomeName}>{user?.name?.split(' ')[0] || 'User'}</Text>
          </Text>
          <Text style={styles.welcomeSubtitle}>Ready to discover your aesthetic potential?</Text>
        </Animated.View>

        {/* Premium Badge */}
        {isPremium && (
          <Animated.View entering={FadeInDown.delay(150).springify()} style={styles.premiumBadge}>
            <Ionicons name="diamond-outline" size={16} color="#eab308" />
            <Text style={styles.premiumText}>Premium Active</Text>
          </Animated.View>
        )}

        {/* Main CTA */}
        <Animated.View entering={FadeInUp.delay(200).springify()}>
          <LinearGradient colors={['rgba(56,189,248,0.2)', 'rgba(14,165,233,0.1)']} style={styles.ctaCard}>
            <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={styles.ctaIcon}>
              <Ionicons name="scan-outline" size={40} color="white" />
            </LinearGradient>
            <Text style={styles.ctaTitle}>Start Scanning Your Face</Text>
            <Text style={styles.ctaSubtitle}>Upload a clear selfie and let our AI analyze your facial features</Text>
            <TouchableOpacity onPress={() => router.push('/scanner?type=face')}>
              <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={styles.ctaButton}>
                <Ionicons name="camera-outline" size={20} color="white" />
                <Text style={styles.ctaButtonText}>Begin Face Analysis</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Scanner Options */}
        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.options}>
          <TouchableOpacity onPress={() => router.push('/scanner?type=face')} style={styles.optionCard}>
            <View style={styles.optionIcon}><Ionicons name="person-outline" size={28} color="#38bdf8" /></View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Face Scanner</Text>
              <Text style={styles.optionSubtitle}>Analyze jawline, symmetry, skin, eyes</Text>
              <View style={styles.optionAction}>
                <Text style={styles.optionActionText}>Start Analysis</Text>
                <Ionicons name="chevron-forward-outline" size={16} color="#38bdf8" />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => isPremium ? router.push('/scanner?type=body') : router.push('/paywall')} style={styles.optionCard}>
            <View style={styles.optionIcon}><Ionicons name="body-outline" size={28} color="#38bdf8" /></View>
            <View style={styles.optionContent}>
              <View style={styles.optionTitleRow}>
                <Text style={styles.optionTitle}>Body Scanner</Text>
                {!isPremium && <View style={styles.premiumTag}><Text style={styles.premiumTagText}>Premium</Text></View>}
              </View>
              <Text style={styles.optionSubtitle}>Body fat, muscle definition, proportions</Text>
              <View style={styles.optionAction}>
                <Text style={styles.optionActionText}>{isPremium ? 'Start Analysis' : 'Unlock Feature'}</Text>
                <Ionicons name="chevron-forward-outline" size={16} color="#38bdf8" />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Upgrade Banner */}
        {!isPremium && (
          <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.upgradeBanner}>
            <TouchableOpacity onPress={() => router.push('/paywall')}>
              <LinearGradient colors={['#0ea5e9', '#38bdf8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.upgradeContent}>
                <Ionicons name="diamond-outline" size={28} color="white" />
                <View style={styles.upgradeText}>
                  <Text style={styles.upgradeTitle}>Go Premium</Text>
                  <Text style={styles.upgradeSubtitle}>Unlock all features for €3.99/week</Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerLogo: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 20, marginLeft: 12 },
  welcome: { paddingHorizontal: 24, paddingVertical: 24 },
  welcomeTitle: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  welcomeName: { color: '#7dd3fc' },
  welcomeSubtitle: { color: '#9ca3af', marginTop: 4 },
  premiumBadge: { marginHorizontal: 24, marginBottom: 16, backgroundColor: 'rgba(234,179,8,0.1)', borderWidth: 1, borderColor: 'rgba(234,179,8,0.3)', borderRadius: 99, paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  premiumText: { color: '#eab308', fontWeight: '600', marginLeft: 8 },
  ctaCard: { marginHorizontal: 24, marginBottom: 24, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(56,189,248,0.3)', alignItems: 'center', paddingVertical: 32 },
  ctaIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  ctaTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  ctaSubtitle: { color: '#9ca3af', textAlign: 'center', marginBottom: 24, paddingHorizontal: 16 },
  ctaButton: { borderRadius: 16, paddingVertical: 16, paddingHorizontal: 32, flexDirection: 'row', alignItems: 'center', shadowColor: '#38bdf8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12 },
  ctaButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  options: { paddingHorizontal: 24, gap: 16 },
  optionCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 20, flexDirection: 'row' },
  optionIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(56,189,248,0.2)', alignItems: 'center', justifyContent: 'center' },
  optionContent: { flex: 1, marginLeft: 16 },
  optionTitleRow: { flexDirection: 'row', alignItems: 'center' },
  optionTitle: { color: 'white', fontWeight: '600', fontSize: 18 },
  premiumTag: { backgroundColor: 'rgba(56,189,248,0.2)', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
  premiumTagText: { color: '#7dd3fc', fontSize: 12 },
  optionSubtitle: { color: '#9ca3af', fontSize: 14, marginTop: 4 },
  optionAction: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  optionActionText: { color: '#7dd3fc', fontSize: 14 },
  upgradeBanner: { marginHorizontal: 24, marginTop: 24 },
  upgradeContent: { borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center' },
  upgradeText: { flex: 1, marginLeft: 16 },
  upgradeTitle: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  upgradeSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
});
