import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function NotificationsScreen() {
  const router = useRouter();

  const handleEnable = async () => {
    // Request notification permissions here
    router.push('/onboarding/face-intro');
  };

  const handleSkip = () => {
    router.push('/onboarding/face-intro');
  };

  return (
    <LinearGradient colors={['#071018', '#0c1929', '#071018']} style={styles.container}>
      {/* Step Indicators */}
      <View style={styles.stepContainer}>
        <View style={styles.stepInactive} />
        <View style={styles.stepInactive} />
        <View style={styles.stepActive} />
        <View style={styles.stepInactive} />
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <Text style={styles.title}>Enable notifications</Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.footer}>
        <TouchableOpacity onPress={handleEnable}>
          <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={styles.continueButton}>
            <Text style={styles.continueText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  stepContainer: { flexDirection: 'row', paddingHorizontal: 24, paddingTop: 60, gap: 8 },
  stepActive: { flex: 1, height: 4, backgroundColor: '#38bdf8', borderRadius: 2 },
  stepInactive: { flex: 1, height: 4, backgroundColor: '#35354a', borderRadius: 2 },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'flex-start', paddingTop: 40 },
  header: { alignItems: 'flex-start' },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  footer: { paddingHorizontal: 24, paddingBottom: 40 },
  continueButton: { borderRadius: 30, paddingVertical: 18, alignItems: 'center' },
  continueText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});
