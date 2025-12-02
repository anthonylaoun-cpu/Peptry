import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { getFaceResults } from '../utils/userData';

const { width, height } = Dimensions.get('window');

// Confetti particle component
function ConfettiParticle({ delay, startX, color }: { delay: number; startX: number; color: string }) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(startX);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(height + 100, { duration: 3000, easing: Easing.linear })
    );
    translateX.value = withDelay(
      delay,
      withTiming(startX + (Math.random() - 0.5) * 100, { duration: 3000 })
    );
    rotate.value = withDelay(
      delay,
      withRepeat(withTiming(360, { duration: 1000 }), -1)
    );
    opacity.value = withDelay(
      delay + 2000,
      withTiming(0, { duration: 1000 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.confetti, { backgroundColor: color }, animatedStyle]} />
  );
}

// Animated ring component
function PulsingRing({ delay, size }: { delay: number; size: number }) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.5, { duration: 1500, easing: Easing.out(Easing.ease) }),
          withTiming(0.8, { duration: 0 })
        ),
        -1
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.6, { duration: 100 }),
          withTiming(0, { duration: 1400 })
        ),
        -1
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.pulsingRing, { width: size, height: size, borderRadius: size / 2 }, animatedStyle]} />
  );
}

// Sparkle component
function Sparkle({ delay, x, y }: { delay: number; x: number; y: number }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withSpring(1, { damping: 5 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        false
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 200 }),
          withTiming(0, { duration: 500 })
        ),
        -1
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    left: x,
    top: y,
  }));

  return (
    <Animated.View style={[styles.sparkle, animatedStyle]}>
      <Ionicons name="star" size={16} color="#fbbf24" />
    </Animated.View>
  );
}

export default function PremiumSuccessScreen() {
  const router = useRouter();
  const [faceResults, setFaceResults] = useState<any>(null);
  const mainScale = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    loadData();
    mainScale.value = withDelay(300, withSpring(1, { damping: 8, stiffness: 100 }));
    checkScale.value = withDelay(600, withSpring(1, { damping: 6, stiffness: 120 }));
  }, []);

  const loadData = async () => {
    const results = await getFaceResults();
    setFaceResults(results);
  };

  const mainAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mainScale.value }],
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const confettiColors = ['#38bdf8', '#ec4899', '#0284c7', '#22c55e', '#fbbf24', '#3b82f6'];

  return (
    <LinearGradient colors={['#071018', '#0c1929', '#071018']} style={styles.container}>
      {/* Confetti */}
      {[...Array(30)].map((_, i) => (
        <ConfettiParticle
          key={i}
          delay={i * 100}
          startX={Math.random() * width}
          color={confettiColors[i % confettiColors.length]}
        />
      ))}

      {/* Background glow */}
      <View style={styles.backgroundGlow} />

      {/* Main content */}
      <View style={styles.content}>
        {/* Success Icon */}
        <Animated.View style={[styles.iconContainer, mainAnimatedStyle]}>
          <PulsingRing delay={0} size={200} />
          <PulsingRing delay={500} size={200} />
          <PulsingRing delay={1000} size={200} />
          
          <LinearGradient 
            colors={['#38bdf8', '#0ea5e9', '#0284c7']} 
            style={styles.iconGradient}
          >
            <Animated.View style={checkAnimatedStyle}>
              <Ionicons name="diamond-outline" size={64} color="white" />
            </Animated.View>
          </LinearGradient>

          {/* Sparkles around icon */}
          <Sparkle delay={800} x={-30} y={20} />
          <Sparkle delay={1200} x={130} y={30} />
          <Sparkle delay={1600} x={20} y={120} />
          <Sparkle delay={2000} x={100} y={-10} />
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.delay(700).springify()}>
          <Text style={styles.title}>Welcome to Premium! 🎉</Text>
          <Text style={styles.subtitle}>You've unlocked your full potential</Text>
        </Animated.View>

        {/* Features unlocked */}
        <Animated.View entering={FadeInUp.delay(900).springify()} style={styles.featuresCard}>
          <LinearGradient colors={['rgba(56,189,248,0.15)', 'rgba(99,102,241,0.1)']} style={styles.featuresGradient}>
            <Text style={styles.featuresTitle}>What's Unlocked</Text>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="eye-outline" size={20} color="#38bdf8" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureName}>Full Face Analysis</Text>
                <Text style={styles.featureDesc}>All scores & detailed breakdown</Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="flask-outline" size={20} color="#ec4899" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureName}>Peptide Protocol</Text>
                <Text style={styles.featureDesc}>Personalized recommendations</Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="time-outline" size={20} color="#0284c7" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureName}>Future Me</Text>
                <Text style={styles.featureDesc}>AI-powered transformation preview</Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="reload-outline" size={20} color="#22c55e" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureName}>Unlimited Scans</Text>
                <Text style={styles.featureDesc}>Track your progress forever</Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Score Preview */}
        {faceResults && (
          <Animated.View entering={FadeInUp.delay(1100).springify()} style={styles.scorePreview}>
            <Text style={styles.scorePreviewLabel}>Your Overall Score</Text>
            <View style={styles.scoreRow}>
              <Text style={styles.bigScore}>{faceResults.overall?.toFixed(1) || '7.5'}</Text>
              <View style={styles.potentialBadge}>
                <Ionicons name="trending-up-outline" size={16} color="#22c55e" />
                <Text style={styles.potentialText}>
                  {faceResults.potential?.toFixed(1) || '8.5'} potential
                </Text>
              </View>
            </View>
          </Animated.View>
        )}
      </View>

      {/* CTA Button */}
      <Animated.View entering={FadeIn.delay(1300)} style={styles.ctaContainer}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} activeOpacity={0.9}>
          <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={styles.ctaButton}>
            <Text style={styles.ctaText}>View My Results</Text>
            <Ionicons name="arrow-forward-outline" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundGlow: { position: 'absolute', top: '20%', left: '50%', marginLeft: -150, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(56,189,248,0.15)' },
  confetti: { position: 'absolute', width: 10, height: 10, borderRadius: 2 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  iconContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  pulsingRing: { position: 'absolute', borderWidth: 2, borderColor: 'rgba(56,189,248,0.5)' },
  iconGradient: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', shadowColor: '#38bdf8', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 24 },
  sparkle: { position: 'absolute' },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#9ca3af', textAlign: 'center', marginBottom: 32 },
  featuresCard: { width: '100%', marginBottom: 24 },
  featuresGradient: { borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(56,189,248,0.2)' },
  featuresTitle: { fontSize: 14, fontWeight: '600', color: '#9ca3af', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  featureIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  featureText: { flex: 1, marginLeft: 12 },
  featureName: { fontSize: 15, fontWeight: '600', color: 'white' },
  featureDesc: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  scorePreview: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 20, width: '100%' },
  scorePreviewLabel: { fontSize: 13, color: '#6b7280', marginBottom: 8 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  bigScore: { fontSize: 48, fontWeight: 'bold', color: 'white' },
  potentialBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(34,197,94,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  potentialText: { color: '#22c55e', fontWeight: '600', fontSize: 14 },
  ctaContainer: { paddingHorizontal: 24, paddingBottom: 48 },
  ctaButton: { borderRadius: 16, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  ctaText: { color: 'white', fontWeight: 'bold', fontSize: 17 },
});
