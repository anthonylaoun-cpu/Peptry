import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function ScanTab() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#0a0a0f', '#12121a', '#0a0a0f']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Facial Analysis</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Main Card */}
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <LinearGradient colors={['#1a1a2e', '#16162a']} style={styles.scanCard}>
            {/* Face placeholder with scan lines */}
            <View style={styles.faceContainer}>
              <View style={styles.facePlaceholder}>
                <Ionicons name="person" size={120} color="#4a4a6a" />
              </View>
              {/* Scan overlay lines */}
              <View style={styles.scanOverlay}>
                {[...Array(8)].map((_, i) => (
                  <View key={i} style={[styles.scanLine, { top: `${12 + i * 11}%` }]} />
                ))}
              </View>
            </View>

            {/* Text */}
            <Text style={styles.cardTitle}>Get your ratings and recommendations</Text>

            {/* Begin Scan Button */}
            <TouchableOpacity onPress={() => router.push('/onboarding/face-scan')} style={styles.scanButtonContainer}>
              <LinearGradient colors={['#a855f7', '#7c3aed']} style={styles.scanButton}>
                <Text style={styles.scanButtonText}>Begin scan</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Pagination dots */}
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.pagination}>
          <View style={styles.dotActive} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  scanCard: { borderRadius: 24, padding: 24, alignItems: 'center' },
  faceContainer: { width: width - 96, height: 280, borderRadius: 16, backgroundColor: '#252540', marginBottom: 24, overflow: 'hidden', position: 'relative' },
  facePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scanOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  scanLine: { position: 'absolute', left: '10%', right: '10%', height: 1, backgroundColor: 'rgba(168,85,247,0.3)' },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 24 },
  scanButtonContainer: { width: '100%' },
  scanButton: { borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
  scanButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  pagination: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 24 },
  dotActive: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'white' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4a4a6a' },
});
