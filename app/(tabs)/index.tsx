import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { getFaceResults, getPremiumStatus } from '../../utils/userData';
import SideDrawer from '../../components/SideDrawer';

const { width } = Dimensions.get('window');

interface FaceResults {
  overall: number;
  potential: number;
  masculinity: number;
  skinQuality: number;
  jawline: number;
  cheekbones: number;
  eyeArea?: number;
  harmony?: number;
  summary?: string;
}

const getScoreColor = (score: number) => {
  if (score < 4) return '#ef4444';
  if (score < 6.5) return '#f97316';
  return '#22c55e';
};

// Results View Component (shown when user has results + premium)
function ResultsView({ results }: { results: FaceResults }) {
  const router = useRouter();
  
  const metrics = [
    { label: 'Overall', score: results.overall },
    { label: 'Potential', score: results.potential },
    { label: 'Masculinity', score: results.masculinity },
    { label: 'Skin Quality', score: results.skinQuality },
    { label: 'Jawline', score: results.jawline },
    { label: 'Cheekbones', score: results.cheekbones },
  ];

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.resultsContent}>
      {/* Main Score */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.mainScoreCard}>
        <LinearGradient colors={['#0f172a', '#0c1929']} style={styles.scoreCardGradient}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{results.overall.toFixed(1)}</Text>
            <Text style={styles.scoreLabel}>Overall</Text>
          </View>
          <View style={styles.potentialBadge}>
            <Ionicons name="trending-up-outline" size={14} color="#22c55e" />
            <Text style={styles.potentialText}>Potential: {results.potential.toFixed(1)}</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Metrics Grid */}
      <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.metricsGrid}>
        {metrics.slice(2).map((metric, index) => (
          <LinearGradient key={metric.label} colors={['#0f172a', '#0c1929']} style={styles.metricCard}>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <Text style={[styles.metricScore, { color: getScoreColor(metric.score) }]}>
              {metric.score.toFixed(1)}
            </Text>
            <View style={styles.metricBar}>
              <View style={[styles.metricFill, { width: `${metric.score * 10}%`, backgroundColor: getScoreColor(metric.score) }]} />
            </View>
          </LinearGradient>
        ))}
      </Animated.View>

      {/* Summary */}
      {results.summary && (
        <Animated.View entering={FadeInUp.delay(300).springify()}>
          <LinearGradient colors={['#0f172a', '#0c1929']} style={styles.summaryCard}>
            <Ionicons name="bulb-outline" size={20} color="#38bdf8" />
            <Text style={styles.summaryText}>{results.summary}</Text>
          </LinearGradient>
        </Animated.View>
      )}

      {/* My Program Banner */}
      <Animated.View entering={FadeInUp.delay(350).springify()}>
        <TouchableOpacity onPress={() => router.push('/peptide-plan')} activeOpacity={0.9}>
          <LinearGradient 
            colors={['#0284c7', '#0ea5e9', '#38bdf8']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.peptideBanner}
          >
            <View style={styles.peptideBannerLeft}>
              <View style={styles.peptideBannerIcon}>
                <Ionicons name="flask-outline" size={28} color="white" />
              </View>
              <View style={styles.peptideBannerText}>
                <Text style={styles.peptideBannerTitle}>Reach Your Full Potential</Text>
                <Text style={styles.peptideBannerSubtitle}>
                  View your personalized program →
                </Text>
              </View>
            </View>
            <View style={styles.peptideBannerSparkle}>
              <Ionicons name="star" size={20} color="#fbbf24" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Rescan Button */}
      <Animated.View entering={FadeInUp.delay(400).springify()}>
        <TouchableOpacity onPress={() => router.push('/onboarding/face-scan')}>
          <LinearGradient colors={['rgba(56,189,248,0.2)', 'rgba(14,165,233,0.1)']} style={styles.rescanBtn}>
            <Ionicons name="refresh-outline" size={20} color="#00D4FF" />
            <Text style={styles.rescanText}>Scan Again</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Main Menu Section */}
      <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.mainMenuSection}>
        <Text style={styles.mainMenuTitle}>Main Menu</Text>
        <Text style={styles.mainMenuSubtitle}>Explore all features</Text>
        
        <View style={styles.menuGrid}>
          <TouchableOpacity style={styles.menuCard} onPress={() => router.push('/onboarding/face-scan')} activeOpacity={0.8}>
            <View style={[styles.menuCardIcon, { backgroundColor: 'rgba(0, 212, 255, 0.12)' }]}>
              <Ionicons name="happy-outline" size={26} color="#00D4FF" />
            </View>
            <Text style={styles.menuCardLabel}>Face Scan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuCard} onPress={() => router.push('/body-scan')} activeOpacity={0.8}>
            <View style={[styles.menuCardIcon, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
              <Ionicons name="fitness-outline" size={26} color="#10b981" />
              <View style={styles.menuCardBadge}><Text style={styles.menuCardBadgeText}>NEW</Text></View>
            </View>
            <Text style={styles.menuCardLabel}>Body Scan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuCard} onPress={() => router.push('/peptide-plan')} activeOpacity={0.8}>
            <View style={[styles.menuCardIcon, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
              <Ionicons name="flask-outline" size={26} color="#f59e0b" />
            </View>
            <Text style={styles.menuCardLabel}>My Program</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuCard} onPress={() => router.push('/future-me')} activeOpacity={0.8}>
            <View style={[styles.menuCardIcon, { backgroundColor: 'rgba(139, 92, 246, 0.12)' }]}>
              <Ionicons name="time-outline" size={26} color="#8b5cf6" />
            </View>
            <Text style={styles.menuCardLabel}>Future Me</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuCard} onPress={() => router.push('/(tabs)/tracker')} activeOpacity={0.8}>
            <View style={[styles.menuCardIcon, { backgroundColor: 'rgba(236, 72, 153, 0.12)' }]}>
              <Ionicons name="bar-chart-outline" size={26} color="#ec4899" />
            </View>
            <Text style={styles.menuCardLabel}>Progress</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuCard} onPress={() => router.push('/(tabs)/coach')} activeOpacity={0.8}>
            <View style={[styles.menuCardIcon, { backgroundColor: 'rgba(6, 182, 212, 0.12)' }]}>
              <Ionicons name="chatbubble-outline" size={26} color="#06b6d4" />
            </View>
            <Text style={styles.menuCardLabel}>AI Coach</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// Animated Logo Component
function AnimatedLogo() {
  const pulseAnim = useSharedValue(1);
  const rotateAnim = useSharedValue(0);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  return (
    <Animated.View style={[styles.animatedLogoWrapper, animatedStyle]}>
      <LinearGradient colors={['#00D4FF', '#0EA5E9', '#0284c7']} style={styles.animatedLogo}>
        <Ionicons name="eye-outline" size={52} color="white" />
      </LinearGradient>
      <View style={styles.logoSparkle1}>
        <Ionicons name="star" size={16} color="#fbbf24" />
      </View>
      <View style={styles.logoSparkle2}>
        <Ionicons name="sparkles" size={14} color="#00D4FF" />
      </View>
    </Animated.View>
  );
}

// Animated Scan Line
function AnimatedScanLine() {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(250, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.movingScanLine, animatedStyle]}>
      <LinearGradient 
        colors={['transparent', '#38bdf8', 'transparent']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.scanLineGradient}
      />
    </Animated.View>
  );
}

// Initial Scan View (shown when no results yet)
function InitialScanView() {
  const router = useRouter();
  
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.initialContent} showsVerticalScrollIndicator={false}>
      {/* Animated Hero Logo */}
      <Animated.View entering={FadeIn.delay(100).duration(800)} style={styles.heroContainer}>
        <AnimatedLogo />
        <Animated.Text entering={FadeInDown.delay(300).springify()} style={styles.heroTitle}>
          LooksMax AI
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(400).springify()} style={styles.heroSubtitle}>
          Unlock your facial potential with AI
        </Animated.Text>
      </Animated.View>

      {/* Main Scan Card */}
      <Animated.View entering={FadeInUp.delay(500).springify()}>
        <LinearGradient colors={['#0f172a', '#0c1929']} style={styles.scanCard}>
          <View style={styles.faceContainer}>
            <View style={styles.facePlaceholder}>
              <Ionicons name="person-outline" size={100} color="#4a4a6a" />
            </View>
            {/* Static scan lines */}
            <View style={styles.scanOverlay}>
              {[...Array(6)].map((_, i) => (
                <View key={i} style={[styles.scanLine, { top: `${15 + i * 14}%` }]} />
              ))}
            </View>
            {/* Animated scan line */}
            <AnimatedScanLine />
          </View>
          <Text style={styles.cardTitle}>Get your ratings and recommendations</Text>
          <TouchableOpacity onPress={() => router.push('/onboarding/face-scan')} style={styles.scanButtonContainer} activeOpacity={0.85}>
            <LinearGradient colors={['#00D4FF', '#0EA5E9']} style={styles.scanButton}>
              <Ionicons name="scan-outline" size={22} color="white" style={{ marginRight: 10 }} />
              <Text style={styles.scanButtonText}>Begin Scan</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

      {/* Feature Cards */}
      <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.featuresRow}>
        <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/onboarding/face-scan')} activeOpacity={0.8}>
          <LinearGradient colors={['rgba(0, 212, 255, 0.12)', 'rgba(14, 165, 233, 0.04)']} style={styles.featureGradient}>
            <Ionicons name="happy-outline" size={32} color="#00D4FF" />
            <Text style={styles.featureTitle}>Face Scan</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/body-scan')} activeOpacity={0.8}>
          <LinearGradient colors={['rgba(0, 212, 255, 0.12)', 'rgba(14, 165, 233, 0.04)']} style={styles.featureGradient}>
            <View style={styles.newBadge}><Text style={styles.newBadgeText}>NEW</Text></View>
            <Ionicons name="fitness-outline" size={32} color="#00D4FF" />
            <Text style={styles.featureTitle}>Body Scan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Stats */}
      <Animated.View entering={FadeInUp.delay(700).springify()} style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>1M+</Text>
          <Text style={styles.statLabel}>Users</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>4.9</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>99%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

export default function ScanTab() {
  const [results, setResults] = useState<FaceResults | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [faceResults, premiumStatus] = await Promise.all([
          getFaceResults(),
          getPremiumStatus(),
        ]);
        setResults(faceResults);
        setIsPremium(premiumStatus.isPremium);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const showResults = results && isPremium;

  return (
    <LinearGradient colors={['#070B14', '#0D1321', '#070B14']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setDrawerVisible(true)} style={styles.menuBtn}>
          <Ionicons name="menu-outline" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{showResults ? 'Your Results' : 'LooksMax AI'}</Text>
        <TouchableOpacity style={styles.menuBtn}>
          <Ionicons name="notifications-outline" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : showResults ? (
        <ResultsView results={results} />
      ) : (
        <InitialScanView />
      )}

      {/* Side Drawer */}
      <SideDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  menuBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#9ca3af', fontSize: 17 },
  animatedLogoWrapper: { position: 'relative', marginBottom: 20 },
  animatedLogo: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', shadowColor: '#00D4FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 30 },
  logoSparkle1: { position: 'absolute', top: -8, right: -8, width: 32, height: 32, borderRadius: 16, backgroundColor: '#0D1321', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(0, 212, 255, 0.3)' },
  logoSparkle2: { position: 'absolute', bottom: 2, left: -10, width: 26, height: 26, borderRadius: 13, backgroundColor: '#0D1321', alignItems: 'center', justifyContent: 'center' },
  movingScanLine: { position: 'absolute', left: '5%', right: '5%', height: 3 },
  scanLineGradient: { height: 3, width: '100%', borderRadius: 2 },
  initialContent: { paddingHorizontal: 24, paddingBottom: 48 },
  heroContainer: { alignItems: 'center', marginBottom: 32, marginTop: 12 },
  heroTitle: { fontSize: 36, fontWeight: '800', color: 'white', marginBottom: 8 },
  heroSubtitle: { fontSize: 17, color: '#94A3B8', textAlign: 'center', lineHeight: 26 },
  featuresRow: { flexDirection: 'row', gap: 16, marginTop: 24, marginBottom: 24 },
  featureCard: { flex: 1 },
  featureGradient: { borderRadius: 18, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  featureTitle: { color: 'white', fontWeight: '600', fontSize: 15, marginTop: 12 },
  statsContainer: { flexDirection: 'row', backgroundColor: '#1A2235', borderRadius: 18, padding: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  statBox: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  statLabel: { fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: '500' },
  statDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.1)' },
  scanCard: { borderRadius: 32, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  faceContainer: { width: width - 100, height: 260, borderRadius: 18, backgroundColor: '#1F2942', marginBottom: 24, overflow: 'hidden', position: 'relative' },
  facePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scanOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scanLine: { position: 'absolute', left: '10%', right: '10%', height: 1, backgroundColor: 'rgba(0, 212, 255, 0.3)' },
  newBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  newBadgeText: { fontSize: 10, fontWeight: 'bold', color: 'white' },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 24, lineHeight: 30 },
  scanButtonContainer: { width: '100%' },
  scanButton: { borderRadius: 9999, paddingVertical: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', shadowColor: '#00D4FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 20 },
  scanButtonText: { color: 'white', fontWeight: 'bold', fontSize: 17 },
  pagination: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 24 },
  dotActive: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'white' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4a4a6a' },
  resultsContent: { paddingHorizontal: 24, paddingBottom: 40 },
  mainScoreCard: { marginBottom: 24 },
  scoreCardGradient: { borderRadius: 32, padding: 40, alignItems: 'center' },
  scoreCircle: { width: 160, height: 160, borderRadius: 80, borderWidth: 5, borderColor: '#00D4FF', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 212, 255, 0.08)', marginBottom: 20, shadowColor: '#00D4FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 20 },
  scoreValue: { fontSize: 48, fontWeight: '800', color: 'white' },
  scoreLabel: { fontSize: 15, color: '#94A3B8', marginTop: 4, fontWeight: '500' },
  potentialBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.12)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 9999, gap: 8, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.2)' },
  potentialText: { color: '#10B981', fontWeight: '600', fontSize: 15 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  metricCard: { width: (width - 64) / 2, borderRadius: 18, padding: 20 },
  metricLabel: { color: '#94A3B8', fontSize: 13, marginBottom: 4, fontWeight: '500' },
  metricScore: { fontSize: 30, fontWeight: 'bold', marginBottom: 12 },
  metricBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 9999, overflow: 'hidden' },
  metricFill: { height: '100%', borderRadius: 9999 },
  summaryCard: { borderRadius: 18, padding: 20, flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 24 },
  summaryText: { flex: 1, color: '#94A3B8', fontSize: 15, lineHeight: 24 },
  rescanBtn: { borderRadius: 18, paddingVertical: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, borderWidth: 1.5, borderColor: 'rgba(0, 212, 255, 0.3)', backgroundColor: 'rgba(0, 212, 255, 0.05)' },
  rescanText: { color: '#00D4FF', fontWeight: '600', fontSize: 17 },
  peptideBanner: { borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, shadowColor: '#00D4FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 30 },
  peptideBannerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  peptideBannerIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  peptideBannerText: { marginLeft: 16, flex: 1 },
  peptideBannerTitle: { fontSize: 17, fontWeight: 'bold', color: 'white' },
  peptideBannerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4, fontWeight: '500' },
  peptideBannerSparkle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.15)', alignItems: 'center', justifyContent: 'center' },
  // Main Menu Styles
  mainMenuSection: { marginTop: 32, paddingTop: 24, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  mainMenuTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  mainMenuSubtitle: { fontSize: 14, color: '#64748B', marginBottom: 20 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  menuCard: { width: (width - 72) / 3, alignItems: 'center', paddingVertical: 16, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  menuCardIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8, position: 'relative' },
  menuCardLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '500', textAlign: 'center' },
  menuCardBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#ef4444', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
  menuCardBadgeText: { fontSize: 7, fontWeight: 'bold', color: 'white' },
});
