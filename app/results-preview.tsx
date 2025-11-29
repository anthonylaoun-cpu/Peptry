import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const metrics = [
  { label: 'Overall' },
  { label: 'Potential' },
  { label: 'Masculinity' },
  { label: 'Skin quality' },
  { label: 'Jawline' },
  { label: 'Cheekbones' },
];

export default function ResultsPreviewScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#0a0a0f', '#12121a', '#0a0a0f']} style={styles.container}>
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
        <Text style={styles.eyeEmoji}>👀</Text>
        <Text style={styles.title}>Reveal your results</Text>
        <Text style={styles.subtitle}>Invite 3 friends or get LooksMax Pro to view your results</Text>
      </Animated.View>

      {/* Blurred Overall Score Preview */}
      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.scorePreview}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreNumber}>7.8</Text>
          <Text style={styles.scoreLabel}>Overall</Text>
          {/* Blur overlay */}
          <View style={styles.blurOverlay}>
            <Ionicons name="lock-closed" size={20} color="rgba(168,85,247,0.8)" />
          </View>
        </View>
        <View style={styles.photoCircle}>
          <Ionicons name="person" size={32} color="#6b7280" />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.metricsCard}>
        <LinearGradient colors={['#1a1a2e', '#16162a']} style={styles.metricsGradient}>
          <View style={styles.metricsGrid}>
            {metrics.map((metric, index) => (
              <View key={index} style={styles.metricItem}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <View style={styles.blurredValue}>
                  <View style={styles.blurCircle} />
                </View>
                <View style={styles.progressBar}>
                  <View style={styles.progressFill} />
                </View>
              </View>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.actions}>
        <TouchableOpacity onPress={() => router.push('/paywall')}>
          <LinearGradient colors={['#a855f7', '#7c3aed']} style={styles.proButton}>
            <Text style={styles.proEmoji}>💪</Text>
            <Text style={styles.proText}>Get LooksMax Pro</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.inviteButton}>
          <Text style={styles.inviteText}>Invite 3 Friends</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 24 },
  eyeEmoji: { fontSize: 32, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  subtitle: { color: '#9ca3af', fontSize: 16, textAlign: 'center' },
  scorePreview: { alignItems: 'center', marginTop: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'center', gap: 20 },
  scoreCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#1a1a2e', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#a855f7', position: 'relative', overflow: 'hidden' },
  scoreNumber: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  scoreLabel: { fontSize: 12, color: '#9ca3af' },
  blurOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,10,15,0.85)', alignItems: 'center', justifyContent: 'center' },
  photoCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#252540', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#a855f7' },
  metricsCard: { paddingHorizontal: 24, flex: 1 },
  metricsGradient: { borderRadius: 24, padding: 24 },
  metricsGrid: { gap: 16 },
  metricItem: { flexDirection: 'row', alignItems: 'center' },
  metricLabel: { color: 'white', fontSize: 16, width: 110 },
  blurredValue: { marginLeft: 16 },
  blurCircle: { width: 40, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)' },
  progressBar: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, marginLeft: 16 },
  progressFill: { width: '60%', height: 4, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 2 },
  actions: { paddingHorizontal: 24, paddingBottom: 40, gap: 12 },
  proButton: { borderRadius: 30, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  proEmoji: { fontSize: 20 },
  proText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  inviteButton: { backgroundColor: '#1a1a2e', borderRadius: 30, paddingVertical: 18, alignItems: 'center' },
  inviteText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});
