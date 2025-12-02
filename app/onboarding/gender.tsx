import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GenderScreen() {
  const router = useRouter();

  const selectGender = async (gender: 'male' | 'female') => {
    await AsyncStorage.setItem('gender', gender);
    router.push('/onboarding/referral');
  };

  return (
    <LinearGradient colors={['#071018', '#0c1929', '#071018']} style={styles.container}>
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
        <Text style={styles.title}>Are you a male or female?</Text>
        <Text style={styles.subtitle}>This helps us personalize your experience</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.cards}>
        <TouchableOpacity onPress={() => selectGender('male')} style={styles.card}>
          <LinearGradient colors={['rgba(56,189,248,0.2)', 'rgba(14,165,233,0.1)']} style={styles.cardGradient}>
            <View style={styles.iconContainer}>
              <Ionicons name="man-outline" size={48} color="#38bdf8" />
            </View>
            <Text style={styles.cardTitle}>Male</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => selectGender('female')} style={styles.card}>
          <LinearGradient colors={['rgba(56,189,248,0.2)', 'rgba(14,165,233,0.1)']} style={styles.cardGradient}>
            <View style={styles.iconContainer}>
              <Ionicons name="woman-outline" size={48} color="#38bdf8" />
            </View>
            <Text style={styles.cardTitle}>Female</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.trust}>
        <Ionicons name="shield-checkmark-outline" size={16} color="#22c55e" />
        <Text style={styles.trustText}>App trusted by 100,000+ users</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  header: { marginTop: 100, alignItems: 'center', marginBottom: 48 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: '#9ca3af', fontSize: 16, textAlign: 'center' },
  cards: { flexDirection: 'row', gap: 16 },
  card: { flex: 1 },
  cardGradient: { borderRadius: 24, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(56,189,248,0.3)' },
  iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(56,189,248,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  cardTitle: { color: 'white', fontSize: 20, fontWeight: '600' },
  trust: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 48 },
  trustText: { color: '#9ca3af', marginLeft: 8 },
});
