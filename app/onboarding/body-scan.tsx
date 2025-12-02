import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function BodyScanScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#071018', '#0c1929', '#071018']} style={styles.container}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={styles.iconGradient}>
            <Ionicons name="body-outline" size={64} color="white" />
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Text style={styles.title}>Body Analysis</Text>
          <Text style={styles.subtitle}>Get detailed insights on your body composition, proportions, and areas for improvement</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).springify()}>
          <LinearGradient colors={['rgba(56,189,248,0.2)', 'rgba(14,165,233,0.1)']} style={styles.infoCard}>
            <Text style={styles.infoTitle}>What we analyze:</Text>
            <View style={styles.infoRow}><Ionicons name="checkmark-circle" size={20} color="#22c55e" /><Text style={styles.infoText}>Body fat estimation</Text></View>
            <View style={styles.infoRow}><Ionicons name="checkmark-circle" size={20} color="#22c55e" /><Text style={styles.infoText}>Muscle definition</Text></View>
            <View style={styles.infoRow}><Ionicons name="checkmark-circle" size={20} color="#22c55e" /><Text style={styles.infoText}>Shoulder-waist ratio</Text></View>
            <View style={styles.infoRow}><Ionicons name="checkmark-circle" size={20} color="#22c55e" /><Text style={styles.infoText}>Posture assessment</Text></View>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.actions}>
          <TouchableOpacity onPress={() => router.push('/scanner?type=body')}>
            <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={styles.primaryBtn}>
              <Ionicons name="camera-outline" size={22} color="white" />
              <Text style={styles.primaryText}>Take Body Photos</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/onboarding/goals')} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip for now</Text>
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
  infoCard: { borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(56,189,248,0.3)', marginBottom: 32 },
  infoTitle: { color: 'white', fontWeight: '600', fontSize: 16, marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  infoText: { color: '#d1d5db', fontSize: 15 },
  actions: { gap: 16 },
  primaryBtn: { borderRadius: 16, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  primaryText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  skipBtn: { paddingVertical: 12, alignItems: 'center' },
  skipText: { color: '#6b7280', fontSize: 16 },
});
