import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function FaceIntroScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#071018', '#0c1929', '#071018']} style={styles.container}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={styles.iconGradient}>
            <Ionicons name="scan-outline" size={64} color="white" />
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Text style={styles.title}>Begin Facial Analysis</Text>
          <Text style={styles.subtitle}>Our AI will analyze your facial features to provide personalized insights and recommendations</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).springify()}>
          <LinearGradient colors={['rgba(56,189,248,0.2)', 'rgba(14,165,233,0.1)']} style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="camera-outline" size={24} color="#38bdf8" />
              <Text style={styles.infoText}>Upload or take a selfie</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#22c55e" />
              <Text style={styles.infoText}>Your photos are private & secure</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={24} color="#38bdf8" />
              <Text style={styles.infoText}>Analysis takes ~30 seconds</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.actions}>
          <TouchableOpacity onPress={() => router.push('/onboarding/face-scan')}>
            <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={styles.startButton}>
              <Ionicons name="camera-outline" size={22} color="white" />
              <Text style={styles.startText}>Start Face Scan</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  iconGradient: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', shadowColor: '#38bdf8', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 12 },
  subtitle: { color: '#9ca3af', fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  infoCard: { borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(56,189,248,0.3)', gap: 20, marginBottom: 32 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  infoText: { color: '#d1d5db', fontSize: 16 },
  actions: {},
  startButton: { borderRadius: 16, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  startText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});
