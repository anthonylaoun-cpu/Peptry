import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function ScanTab() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#0a0a0f', '#12121a', '#0a0a0f']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan</Text>
        <Text style={styles.headerSubtitle}>Re-scan to track your progress</Text>
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <TouchableOpacity onPress={() => router.push('/scanner?type=face')}>
            <LinearGradient colors={['rgba(168,85,247,0.2)', 'rgba(124,58,237,0.1)']} style={styles.scanCard}>
              <LinearGradient colors={['#a855f7', '#7c3aed']} style={styles.iconGradient}>
                <Ionicons name="person" size={40} color="white" />
              </LinearGradient>
              <Text style={styles.cardTitle}>Face Scan</Text>
              <Text style={styles.cardSubtitle}>Analyze your facial features and track improvements</Text>
              <View style={styles.startBtn}>
                <Text style={styles.startText}>Start Scan</Text>
                <Ionicons name="arrow-forward" size={18} color="#a855f7" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).springify()}>
          <TouchableOpacity onPress={() => router.push('/scanner?type=body')}>
            <LinearGradient colors={['rgba(168,85,247,0.2)', 'rgba(124,58,237,0.1)']} style={styles.scanCard}>
              <LinearGradient colors={['#a855f7', '#7c3aed']} style={styles.iconGradient}>
                <Ionicons name="body" size={40} color="white" />
              </LinearGradient>
              <Text style={styles.cardTitle}>Body Scan</Text>
              <Text style={styles.cardSubtitle}>Track your body composition and physique progress</Text>
              <View style={styles.startBtn}>
                <Text style={styles.startText}>Start Scan</Text>
                <Ionicons name="arrow-forward" size={18} color="#a855f7" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={24} color="#eab308" />
          <Text style={styles.tipText}>For best results, scan in similar lighting conditions each time</Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { color: '#9ca3af', marginTop: 4 },
  content: { flex: 1, paddingHorizontal: 24, gap: 20 },
  scanCard: { borderRadius: 24, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(168,85,247,0.3)' },
  iconGradient: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  cardSubtitle: { color: '#9ca3af', textAlign: 'center', marginBottom: 20 },
  startBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  startText: { color: '#a855f7', fontWeight: '600', fontSize: 16 },
  tipCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(234,179,8,0.1)', borderRadius: 16, padding: 16, gap: 12 },
  tipText: { flex: 1, color: '#eab308', fontSize: 14 },
});
