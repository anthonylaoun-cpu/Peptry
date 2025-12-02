import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { getFaceResults, getPremiumStatus } from '../utils/userData';

// Metrics with color coding for sneak peek
const metrics = [
  { label: 'Overall', color: '#22c55e', value: 7.8, width: '78%' },
  { label: 'Potential', color: '#10b981', value: 8.5, width: '85%' },
  { label: 'Masculinity', color: '#f97316', value: 6.2, width: '62%' },
  { label: 'Skin Quality', color: '#22c55e', value: 7.5, width: '75%' },
  { label: 'Jawline', color: '#eab308', value: 6.8, width: '68%' },
  { label: 'Cheekbones', color: '#22c55e', value: 7.2, width: '72%' },
];

// Menu categories for premium users
const menuCategories = [
  { icon: 'happy-outline', label: 'Face Scan', route: '/onboarding/face-scan', color: '#00D4FF' },
  { icon: 'fitness-outline', label: 'Body Scan', route: '/body-scan', color: '#10b981', badge: 'NEW' },
  { icon: 'flask-outline', label: 'My Program', route: '/peptide-plan', color: '#f59e0b' },
  { icon: 'time-outline', label: 'Future Me', route: '/future-me', color: '#8b5cf6' },
  { icon: 'bar-chart-outline', label: 'Progress', route: '/(tabs)/tracker', color: '#ec4899' },
  { icon: 'chatbubble-outline', label: 'AI Coach', route: '/(tabs)/coach', color: '#06b6d4' },
];

export default function ResultsPreviewScreen() {
  const router = useRouter();
  const [isPremium, setIsPremium] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const [premium, results] = await Promise.all([
        getPremiumStatus(),
        getFaceResults()
      ]);
      setIsPremium(premium.isPremium);
      setHasResults(!!results);
    };
    checkStatus();
  }, []);

  // Premium user with results - show success + menu
  if (isPremium && hasResults) {
    return (
      <LinearGradient colors={['#071018', '#0c1929', '#071018']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.premiumContent}>
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.successHeader}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={64} color="#22c55e" />
            </View>
            <Text style={styles.successTitle}>Analysis Complete!</Text>
            <Text style={styles.successSubtitle}>Your results are ready to view</Text>
          </Animated.View>

          {/* View Results Button */}
          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <TouchableOpacity onPress={() => router.replace('/(tabs)')} activeOpacity={0.9}>
              <LinearGradient colors={['#00D4FF', '#0ea5e9']} style={styles.viewResultsBtn}>
                <Ionicons name="eye-outline" size={24} color="white" />
                <Text style={styles.viewResultsText}>View My Results</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Explore Menu */}
          <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.exploreSection}>
            <Text style={styles.exploreTitle}>Explore Features</Text>
            <Text style={styles.exploreSubtitle}>Unlock your full potential</Text>
            
            <View style={styles.menuGrid}>
              {menuCategories.map((item, index) => (
                <Animated.View key={item.label} entering={FadeInUp.delay(400 + index * 50).springify()}>
                  <TouchableOpacity 
                    style={styles.menuItem} 
                    onPress={() => router.push(item.route as any)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.menuIconBg, { backgroundColor: `${item.color}15` }]}>
                      <Ionicons name={item.icon as any} size={28} color={item.color} />
                      {item.badge && (
                        <View style={styles.menuBadge}>
                          <Text style={styles.menuBadgeText}>{item.badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    );
  }

  // Non-premium user - show blurred sneak peek
  return (
    <LinearGradient colors={['#071018', '#0c1929', '#071018']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <Text style={styles.eyeEmoji}>👀</Text>
          <Text style={styles.title}>Your Results Are Ready</Text>
          <Text style={styles.subtitle}>Unlock to see your full analysis</Text>
        </Animated.View>

        {/* Fully Locked Score Preview */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.scorePreview}>
          <View style={styles.scoreCircle}>
            <LinearGradient colors={['#22c55e', '#10b981']} style={styles.scoreGradientBg}>
              {/* Score hidden */}
            </LinearGradient>
            {/* Full blur overlay - score completely hidden */}
            <View style={styles.blurOverlayFull}>
              <View style={styles.lockCircle}>
                <Ionicons name="lock-closed" size={24} color="white" />
              </View>
              <Text style={styles.lockedText}>Locked</Text>
            </View>
          </View>
        </Animated.View>

        {/* Colorful Blurred Metrics Grid */}
        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.metricsCard}>
          <LinearGradient colors={['#0f172a', '#0c1929']} style={styles.metricsGradient}>
            <View style={styles.metricsGrid}>
              {metrics.map((metric, index) => (
                <Animated.View key={index} entering={FadeInUp.delay(350 + index * 50).springify()}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>{metric.label}</Text>
                    <View style={styles.metricRight}>
                      {/* Blurred value with color hint */}
                      <View style={[styles.blurredValue, { backgroundColor: `${metric.color}20` }]}>
                        <Text style={[styles.blurredNumber, { color: metric.color }]}>?</Text>
                      </View>
                      {/* Colorful progress bar */}
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: metric.width as any, backgroundColor: metric.color }]} />
                        <View style={styles.progressBlur} />
                      </View>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Premium Benefits */}
        <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>What you'll unlock:</Text>
          <View style={styles.benefitsList}>
            {['Full score breakdown', 'AI improvement tips', 'Personalized program', 'Progress tracking'].map((benefit, i) => (
              <View key={i} style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.actions}>
          <TouchableOpacity onPress={() => router.push('/paywall')} activeOpacity={0.9}>
            <LinearGradient colors={['#00D4FF', '#0ea5e9']} style={styles.proButton}>
              <Ionicons name="diamond" size={22} color="white" />
              <Text style={styles.proText}>Unlock Full Results</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.inviteButton} activeOpacity={0.8}>
            <Ionicons name="people-outline" size={20} color="#9ca3af" />
            <Text style={styles.inviteText}>Or Invite 3 Friends</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 24 },
  eyeEmoji: { fontSize: 40, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  subtitle: { color: '#9ca3af', fontSize: 16, textAlign: 'center' },
  
  // Score Preview
  scorePreview: { alignItems: 'center', marginTop: 24, marginBottom: 24 },
  scoreCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#0c1929', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#22c55e', position: 'relative', overflow: 'hidden' },
  scoreGradientBg: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 70 },
  scoreNumber: { fontSize: 42, fontWeight: 'bold', color: 'white' },
  scoreLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  blurOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(7,16,24,0.7)', alignItems: 'center', justifyContent: 'center' },
  blurOverlayFull: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0c1929', alignItems: 'center', justifyContent: 'center', borderRadius: 70 },
  lockCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)' },
  lockedText: { color: '#6b7280', fontSize: 12, marginTop: 8, fontWeight: '500' },
  
  // Metrics
  metricsCard: { paddingHorizontal: 24, marginBottom: 20 },
  metricsGradient: { borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  metricsGrid: { gap: 14 },
  metricItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  metricLabel: { color: 'white', fontSize: 15, fontWeight: '500', width: 100 },
  metricRight: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
  blurredValue: { width: 36, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  blurredNumber: { fontSize: 16, fontWeight: 'bold' },
  progressBar: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden', position: 'relative' },
  progressFill: { height: 8, borderRadius: 4 },
  progressBlur: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(7,16,24,0.5)' },
  
  // Benefits
  benefitsCard: { paddingHorizontal: 24, marginBottom: 24 },
  benefitsTitle: { color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  benefitsList: { gap: 10 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  benefitText: { color: '#9ca3af', fontSize: 15 },
  
  // Actions
  actions: { paddingHorizontal: 24, paddingBottom: 40, gap: 12 },
  proButton: { borderRadius: 30, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: '#00D4FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 16 },
  proText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  inviteButton: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 30, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  inviteText: { color: '#9ca3af', fontWeight: '600', fontSize: 16 },
  
  // Premium Content Styles
  premiumContent: { paddingBottom: 40 },
  successHeader: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 24, marginBottom: 32 },
  successIcon: { marginBottom: 16 },
  successTitle: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  successSubtitle: { color: '#9ca3af', fontSize: 16, textAlign: 'center' },
  viewResultsBtn: { marginHorizontal: 24, borderRadius: 30, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: '#00D4FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 16 },
  viewResultsText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  
  // Explore Section
  exploreSection: { paddingHorizontal: 24, marginTop: 40 },
  exploreTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  exploreSubtitle: { color: '#9ca3af', fontSize: 14, marginBottom: 24 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  menuItem: { width: '30%', alignItems: 'center' },
  menuIconBg: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8, position: 'relative' },
  menuBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#ef4444', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 6 },
  menuBadgeText: { color: 'white', fontSize: 8, fontWeight: 'bold' },
  menuLabel: { color: 'white', fontSize: 12, fontWeight: '500', textAlign: 'center' },
});
