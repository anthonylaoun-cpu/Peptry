import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

const features = ['Full Face Score & Breakdown', 'Detailed Metric Analysis', 'AI Improvement Insights', 'Body Scanner Access', 'Personalized Peptide Program', 'Unlimited Scans'];

export default function PaywallScreen() {
  const router = useRouter();

  const handleSubscribe = async () => {
    await AsyncStorage.setItem('isPremium', 'true');
    // Generate mock results after payment
    const faceResults = {
      overallScore: +(6 + Math.random() * 2.5).toFixed(1),
      metrics: [
        { category: 'Jawline Definition', score: +(5.5 + Math.random() * 3).toFixed(1), description: 'Angular structure' },
        { category: 'Facial Symmetry', score: +(6 + Math.random() * 2.5).toFixed(1), description: 'Good balance' },
        { category: 'Skin Clarity', score: +(5.5 + Math.random() * 3).toFixed(1), description: 'Healthy texture' },
        { category: 'Eye Area', score: +(6 + Math.random() * 2.5).toFixed(1), description: 'Well-proportioned' },
      ],
      strengths: ['Good symmetry', 'Strong jawline'],
      improvements: ['Skin texture', 'Eye area definition'],
    };
    await AsyncStorage.setItem('faceResults', JSON.stringify(faceResults));
    router.push('/onboarding/body-scan');
  };

  return (
    <LinearGradient colors={['#0a0a0f', '#12121a', '#0a0a0f']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.closeRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.iconContainer}>
          <LinearGradient colors={['#a855f7', '#7c3aed']} style={styles.icon}>
            <Ionicons name="diamond" size={48} color="white" />
          </LinearGradient>
          <View style={styles.sparkle}><Ionicons name="sparkles" size={16} color="white" /></View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.titleContainer}>
          <Text style={styles.title}>Unlock Your Results</Text>
          <Text style={styles.subtitle}>Get full access to your personalized analysis</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.features}>
          {features.map((feature, index) => (
            <Animated.View key={feature} entering={FadeInUp.delay(400 + index * 50).springify()} style={styles.featureRow}>
              <View style={styles.checkIcon}><Ionicons name="checkmark" size={14} color="#a855f7" /></View>
              <Text style={styles.featureText}>{feature}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.priceContainer}>
          <Text style={styles.price}>€3.99</Text>
          <Text style={styles.period}>/week</Text>
        </Animated.View>
        <Text style={styles.cancel}>Cancel anytime</Text>

        <Animated.View entering={FadeInUp.delay(700).springify()}>
          <TouchableOpacity onPress={handleSubscribe}>
            <LinearGradient colors={['#a855f7', '#7c3aed']} style={styles.ctaButton}>
              <Ionicons name="diamond" size={22} color="white" />
              <Text style={styles.ctaText}>Activate LooksMax Premium</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.Text entering={FadeInUp.delay(800).springify()} style={styles.terms}>
          By subscribing, you agree to our Terms of Service and Privacy Policy
        </Animated.Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },
  closeRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 60 },
  closeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  iconContainer: { alignItems: 'center', marginTop: 32, marginBottom: 24 },
  icon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', shadowColor: '#a855f7', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 30 },
  sparkle: { position: 'absolute', top: -8, right: '35%', width: 32, height: 32, borderRadius: 16, backgroundColor: '#eab308', alignItems: 'center', justifyContent: 'center' },
  titleContainer: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  subtitle: { color: '#9ca3af', textAlign: 'center' },
  features: { gap: 12, marginBottom: 32 },
  featureRow: { flexDirection: 'row', alignItems: 'center' },
  checkIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(168,85,247,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  featureText: { color: '#d1d5db', fontSize: 16 },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' },
  price: { fontSize: 48, fontWeight: 'bold', color: 'white' },
  period: { fontSize: 18, color: '#9ca3af', marginLeft: 4 },
  cancel: { color: '#6b7280', textAlign: 'center', marginTop: 4, marginBottom: 24 },
  ctaButton: { borderRadius: 16, paddingVertical: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#a855f7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 16 },
  ctaText: { color: 'white', fontWeight: 'bold', fontSize: 18, marginLeft: 12 },
  terms: { color: '#6b7280', fontSize: 12, textAlign: 'center', marginTop: 16, marginBottom: 32 },
});
