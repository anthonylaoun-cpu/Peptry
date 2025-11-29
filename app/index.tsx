import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthScreen() {
  const router = useRouter();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (provider: string) => {
    if (provider === 'email') {
      setShowEmailForm(true);
      return;
    }
    
    setIsLoading(true);
    setTimeout(async () => {
      await AsyncStorage.setItem('user', JSON.stringify({ 
        name: 'User', 
        email: 'user@example.com',
        provider 
      }));
      setIsLoading(false);
      router.replace('/onboarding/gender');
    }, 1000);
  };

  const handleEmailSignIn = async () => {
    if (!email || !password) return;
    
    setIsLoading(true);
    setTimeout(async () => {
      await AsyncStorage.setItem('user', JSON.stringify({ 
        name: email.split('@')[0], 
        email,
        provider: 'email' 
      }));
      setIsLoading(false);
      router.replace('/onboarding/gender');
    }, 1000);
  };

  return (
    <LinearGradient colors={['#0a0a0f', '#12121a', '#0a0a0f']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.logoContainer}>
          <LinearGradient colors={['#a855f7', '#7c3aed']} style={styles.logo}>
            <Ionicons name="sparkles" size={48} color="white" />
          </LinearGradient>
        </Animated.View>

        {/* Trust Badge */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.trustBadge}>
          <Text style={styles.trustText}>Trusted by 1,000,000+ people</Text>
          <View style={styles.starsRow}>
            {[1,2,3,4,5].map(i => <Ionicons key={i} name="star" size={24} color="#fbbf24" />)}
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.titleContainer}>
          <Text style={styles.title}>
            <Text style={styles.titlePurple}>LooksMax</Text>
            <Text style={styles.titleWhite}> AI</Text>
          </Text>
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(500).springify()} style={styles.subtitle}>
          Unlock your aesthetic potential with AI-powered analysis
        </Animated.Text>

        {/* Auth Buttons */}
        <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.authContainer}>
          {/* Google */}
          <TouchableOpacity onPress={() => handleSignIn('google')} disabled={isLoading} style={styles.authButton}>
            <Ionicons name="logo-google" size={20} color="white" />
            <Text style={styles.authButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Apple */}
          <TouchableOpacity onPress={() => handleSignIn('apple')} disabled={isLoading} style={styles.authButtonSecondary}>
            <Ionicons name="logo-apple" size={22} color="white" />
            <Text style={styles.authButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

          {/* Email */}
          {!showEmailForm ? (
            <TouchableOpacity onPress={() => handleSignIn('email')} disabled={isLoading} style={styles.authButtonSecondary}>
              <Ionicons name="mail-outline" size={22} color="white" />
              <Text style={styles.authButtonText}>Continue with Email</Text>
            </TouchableOpacity>
          ) : (
            <Animated.View entering={FadeInDown.springify()} style={styles.emailForm}>
              <TextInput
                placeholder="Email address"
                placeholderTextColor="#6b7280"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#6b7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
              <TouchableOpacity onPress={handleEmailSignIn} disabled={isLoading}>
                <LinearGradient colors={['#a855f7', '#7c3aed']} style={styles.signInButton}>
                  <Text style={styles.signInButtonText}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowEmailForm(false)} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Back to other options</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>

        <Animated.Text entering={FadeInUp.delay(700).springify()} style={styles.terms}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Animated.Text>

        {/* Features */}
        <Animated.View entering={FadeInUp.delay(800).springify()} style={styles.features}>
          {[
            { icon: 'scan-outline', label: 'Face AI' },
            { icon: 'body-outline', label: 'Body AI' },
            { icon: 'analytics-outline', label: 'Insights' },
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon as any} size={26} color="#a855f7" />
              </View>
              <Text style={styles.featureLabel}>{feature.label}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 96, height: 96, borderRadius: 24, alignItems: 'center', justifyContent: 'center', shadowColor: '#a855f7', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 20 },
  titleContainer: { alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 48, fontWeight: 'bold' },
  titlePurple: { color: '#c084fc' },
  titleWhite: { color: 'white' },
  subtitle: { color: '#9ca3af', textAlign: 'center', fontSize: 18, marginBottom: 40 },
  authContainer: { gap: 16 },
  authButton: { backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  authButtonSecondary: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  authButtonText: { color: 'white', fontWeight: '600', marginLeft: 12, fontSize: 16 },
  emailForm: { gap: 12 },
  input: { backgroundColor: '#1a1a25', borderWidth: 1, borderColor: '#35354a', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, color: 'white', fontSize: 16 },
  signInButton: { borderRadius: 16, paddingVertical: 16, alignItems: 'center', shadowColor: '#a855f7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 },
  signInButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  backButton: { paddingVertical: 8 },
  backButtonText: { color: '#9ca3af', textAlign: 'center' },
  terms: { color: '#6b7280', textAlign: 'center', fontSize: 12, marginTop: 24 },
  trustBadge: { alignItems: 'center', marginBottom: 24 },
  trustText: { color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  starsRow: { flexDirection: 'row', gap: 4 },
  features: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 48, marginBottom: 32 },
  featureItem: { alignItems: 'center' },
  featureIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(168,85,247,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  featureLabel: { color: '#9ca3af', fontSize: 12 },
});
