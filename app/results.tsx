import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle } from 'react-native-svg';

interface Metric { category: string; score: number; description: string; }
interface Results { overallScore: number; metrics: Metric[]; strengths: string[]; improvements: string[]; }

function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = (score / 10) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const color = score >= 8 ? '#22c55e' : score >= 6 ? '#eab308' : score >= 4 ? '#f97316' : '#ef4444';

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} fill="none" />
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ fontSize: 48, fontWeight: 'bold', color: 'white' }}>{score.toFixed(1)}</Text>
        <Text style={{ color: '#9ca3af', fontSize: 14 }}>/10</Text>
      </View>
    </View>
  );
}

function MetricBar({ metric, index }: { metric: Metric; index: number }) {
  const percentage = (metric.score / 10) * 100;
  const colors: [string, string] = metric.score >= 8 ? ['#22c55e', '#16a34a'] : metric.score >= 6 ? ['#eab308', '#ca8a04'] : ['#f97316', '#ea580c'];

  return (
    <Animated.View entering={FadeInUp.delay(index * 100).springify()} style={styles.metricItem}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricLabel}>{metric.category}</Text>
        <Text style={styles.metricScore}>{metric.score.toFixed(1)}</Text>
      </View>
      <View style={styles.metricBarBg}>
        <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.metricBarFill, { width: `${percentage}%` }]} />
      </View>
      <Text style={styles.metricDesc}>{metric.description}</Text>
    </Animated.View>
  );
}

export default function ResultsScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: 'face' | 'body' }>();
  const scanType = type || 'face';
  const [results, setResults] = useState<Results | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadResults();
    checkPremium();
  }, []);

  const loadResults = async () => {
    const data = await AsyncStorage.getItem(`${scanType}Results`);
    if (data) setResults(JSON.parse(data));
  };

  const checkPremium = async () => {
    const premium = await AsyncStorage.getItem('isPremium');
    setIsPremium(premium === 'true');
  };

  if (!results) return (
    <LinearGradient colors={['#071018', '#0c1929', '#071018']} style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={{ color: 'white' }}>Loading results...</Text>
    </LinearGradient>
  );

  return (
    <LinearGradient colors={['#071018', '#0c1929', '#071018']} style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/dashboard')}><Ionicons name="arrow-back-outline" size={24} color="white" /></TouchableOpacity>
          <Text style={styles.headerTitle}>{scanType === 'face' ? 'Face' : 'Body'} Analysis</Text>
          <View style={{ width: 24 }} />
        </View>

        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <LinearGradient colors={['rgba(56,189,248,0.2)', 'rgba(14,165,233,0.1)']} style={styles.scoreCard}>
            <Text style={styles.scoreTitle}>Your {scanType === 'face' ? 'Face' : 'Body'} Score</Text>
            <View style={[!isPremium && styles.blurred]}>
              <ScoreRing score={results.overallScore} />
            </View>
            {!isPremium && (
              <TouchableOpacity onPress={() => router.push('/paywall')} style={styles.unlockButton}>
                <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={styles.unlockGradient}>
                  <Ionicons name="lock-closed-outline" size={18} color="white" />
                  <Text style={styles.unlockText}>Unlock Results</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.metricsCard}>
          <Text style={styles.sectionTitle}>Detailed Breakdown</Text>
          <View style={[!isPremium && styles.blurred]}>
            {results.metrics.map((metric, index) => (
              <MetricBar key={metric.category} metric={metric} index={index} />
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.insightsContainer}>
          <View style={[styles.insightCard, !isPremium && styles.blurred]}>
            <View style={styles.insightHeader}>
              <View style={[styles.insightIcon, { backgroundColor: 'rgba(34,197,94,0.2)' }]}><Ionicons name="trending-up-outline" size={20} color="#22c55e" /></View>
              <Text style={styles.insightTitle}>Strengths</Text>
            </View>
            {results.strengths.map((s, i) => (
              <View key={i} style={styles.insightItem}><Ionicons name="checkmark-circle" size={16} color="#22c55e" /><Text style={styles.insightText}>{s}</Text></View>
            ))}
          </View>

          <View style={[styles.insightCard, !isPremium && styles.blurred]}>
            <View style={styles.insightHeader}>
              <View style={[styles.insightIcon, { backgroundColor: 'rgba(249,115,22,0.2)' }]}><Ionicons name="trending-down-outline" size={20} color="#f97316" /></View>
              <Text style={styles.insightTitle}>Areas to Improve</Text>
            </View>
            {results.improvements.map((s, i) => (
              <View key={i} style={styles.insightItem}><Ionicons name="chevron-forward-outline" size={16} color="#f97316" /><Text style={styles.insightText}>{s}</Text></View>
            ))}
          </View>
        </Animated.View>

        {!isPremium && (
          <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.upgradeBanner}>
            <TouchableOpacity onPress={() => router.push('/paywall')}>
              <LinearGradient colors={['#0ea5e9', '#38bdf8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.upgradeContent}>
                <Ionicons name="diamond-outline" size={28} color="white" />
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={styles.upgradeTitle}>Unlock Full Analysis</Text>
                  <Text style={styles.upgradeSubtitle}>See all your scores for €3.99/week</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 20 },
  scoreCard: { marginHorizontal: 24, marginBottom: 24, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(56,189,248,0.3)', alignItems: 'center' },
  scoreTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 16 },
  blurred: { opacity: 0.2 },
  unlockButton: { position: 'absolute', top: '50%', marginTop: 20 },
  unlockGradient: { borderRadius: 16, paddingVertical: 12, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center' },
  unlockText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },
  metricsCard: { marginHorizontal: 24, marginBottom: 24, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 24 },
  metricItem: { marginBottom: 16 },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  metricLabel: { color: 'white', fontWeight: '500' },
  metricScore: { color: '#7dd3fc', fontWeight: 'bold' },
  metricBarBg: { height: 12, backgroundColor: '#252535', borderRadius: 6, overflow: 'hidden' },
  metricBarFill: { height: 12, borderRadius: 6 },
  metricDesc: { color: '#6b7280', fontSize: 12, marginTop: 4 },
  insightsContainer: { paddingHorizontal: 24, gap: 16 },
  insightCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 24 },
  insightHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  insightIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  insightTitle: { color: 'white', fontWeight: '600', fontSize: 18, marginLeft: 12 },
  insightItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  insightText: { color: '#d1d5db', marginLeft: 12 },
  upgradeBanner: { marginHorizontal: 24, marginTop: 24 },
  upgradeContent: { borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center' },
  upgradeTitle: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  upgradeSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
});
