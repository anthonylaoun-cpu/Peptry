import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

const goals = [
  { id: 'look-better', icon: 'sparkles', label: 'Look better (general)' },
  { id: 'gain-muscle', icon: 'barbell', label: 'Gain muscle' },
  { id: 'lose-fat', icon: 'flame', label: 'Lose fat' },
  { id: 'symmetry', icon: 'git-compare', label: 'Improve symmetry' },
  { id: 'anti-aging', icon: 'time', label: 'Anti-aging' },
  { id: 'jawline', icon: 'person', label: 'Jawline / neck definition' },
  { id: 'skin', icon: 'water', label: 'Skin improvement' },
  { id: 'custom', icon: 'add-circle', label: 'Custom goal' },
];

export default function GoalsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleGoal = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  const handleContinue = async () => {
    await AsyncStorage.setItem('goals', JSON.stringify(selected));
    router.push('/(tabs)');
  };

  return (
    <LinearGradient colors={['#071018', '#0c1929', '#071018']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back-outline" size={24} color="white" /></TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Text style={styles.title}>What are your goals?</Text>
          <Text style={styles.subtitle}>Select all that apply to personalize your experience</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.grid}>
          {goals.map((goal, index) => (
            <TouchableOpacity key={goal.id} onPress={() => toggleGoal(goal.id)} style={styles.goalCard}>
              <LinearGradient
                colors={selected.includes(goal.id) ? ['#38bdf8', '#0ea5e9'] : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                style={[styles.goalGradient, selected.includes(goal.id) && styles.goalSelected]}
              >
                <Ionicons name={goal.icon as any} size={28} color={selected.includes(goal.id) ? 'white' : '#38bdf8'} />
                <Text style={[styles.goalText, selected.includes(goal.id) && styles.goalTextSelected]}>{goal.label}</Text>
                {selected.includes(goal.id) && (
                  <View style={styles.checkmark}><Ionicons name="checkmark-outline" size={16} color="white" /></View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </ScrollView>

      <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.footer}>
        <TouchableOpacity onPress={handleContinue} disabled={selected.length === 0}>
          <LinearGradient colors={selected.length > 0 ? ['#38bdf8', '#0ea5e9'] : ['#35354a', '#252535']} style={styles.continueBtn}>
            <Text style={styles.continueText}>Continue</Text>
            <Ionicons name="arrow-forward-outline" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: '#9ca3af', fontSize: 16, textAlign: 'center', marginBottom: 32 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  goalCard: { width: '48%' },
  goalGradient: { borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', minHeight: 100, justifyContent: 'center' },
  goalSelected: { borderColor: '#38bdf8' },
  goalText: { color: '#d1d5db', fontSize: 14, textAlign: 'center', marginTop: 12 },
  goalTextSelected: { color: 'white', fontWeight: '600' },
  checkmark: { position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  footer: { paddingHorizontal: 24, paddingBottom: 32 },
  continueBtn: { borderRadius: 16, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  continueText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});
