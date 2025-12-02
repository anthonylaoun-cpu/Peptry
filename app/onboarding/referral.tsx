import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReferralScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');

  const handleContinue = async () => {
    if (code) await AsyncStorage.setItem('referralCode', code);
    router.push('/onboarding/notifications');
  };

  return (
    <LinearGradient colors={['#071018', '#0c1929', '#071018']} style={styles.container}>
      {/* Step Indicators */}
      <View style={styles.stepContainer}>
        <View style={styles.stepInactive} />
        <View style={styles.stepActive} />
        <View style={styles.stepInactive} />
        <View style={styles.stepInactive} />
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <Text style={styles.title}>Do you have a referral code?</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your code here, or skip"
            placeholderTextColor="#6b7280"
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            style={styles.input}
          />
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.footer}>
        <TouchableOpacity onPress={handleContinue}>
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
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 48 },
  title: { fontSize: 26, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  inputContainer: { marginBottom: 24 },
  input: { backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: '#35354a', paddingVertical: 16, paddingHorizontal: 4, color: 'white', fontSize: 16 },
  footer: { paddingHorizontal: 24, paddingBottom: 40 },
  continueButton: { borderRadius: 30, paddingVertical: 18, alignItems: 'center' },
  continueText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});
