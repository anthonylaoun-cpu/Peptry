import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface Goal {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  benefits: string[];
}

const goals: Goal[] = [
  {
    id: 'anti-aging',
    title: 'Anti-Aging',
    description: 'Reduce wrinkles, improve skin elasticity',
    icon: 'hourglass-outline',
    color: '#38bdf8',
    benefits: ['Collagen production', 'Skin firmness', 'Fine line reduction'],
  },
  {
    id: 'skin-quality',
    title: 'Skin Quality',
    description: 'Clear skin, even tone, reduce acne',
    icon: 'sparkles',
    color: '#ec4899',
    benefits: ['Acne reduction', 'Even skin tone', 'Pore minimization'],
  },
  {
    id: 'facial-structure',
    title: 'Facial Structure',
    description: 'Enhance jawline, cheekbones',
    icon: 'diamond-outline',
    color: '#3b82f6',
    benefits: ['Jawline definition', 'Bone density', 'Facial symmetry'],
  },
  {
    id: 'muscle-growth',
    title: 'Muscle Growth',
    description: 'Build lean muscle mass',
    icon: 'barbell-outline',
    color: '#22c55e',
    benefits: ['Lean mass', 'Strength gains', 'Recovery speed'],
  },
  {
    id: 'fat-loss',
    title: 'Fat Loss',
    description: 'Reduce body fat, improve composition',
    icon: 'flame-outline',
    color: '#f97316',
    benefits: ['Visceral fat reduction', 'Metabolism boost', 'Body recomp'],
  },
  {
    id: 'overall-optimization',
    title: 'Overall Optimization',
    description: 'Complete enhancement protocol',
    icon: 'rocket-outline',
    color: '#0284c7',
    benefits: ['Full body optimization', 'Energy & vitality', 'Peak performance'],
  },
];

export default function GoalSelectionScreen() {
  const router = useRouter();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleContinue = async () => {
    if (selectedGoals.length === 0) return;
    
    // Save selected goals
    await AsyncStorage.setItem('userGoals', JSON.stringify(selectedGoals));
    
    // Navigate to results preview (shows blurred score + buy premium)
    router.push('/results-preview');
  };

  return (
    <LinearGradient colors={['#071018', '#0c1929', '#071018']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Goals</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.hero}>
          <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={styles.heroIcon}>
            <Ionicons name="flag-outline" size={32} color="white" />
          </LinearGradient>
          <Text style={styles.heroTitle}>What are your goals?</Text>
          <Text style={styles.heroSubtitle}>
            Select one or more goals to get personalized peptide recommendations
          </Text>
        </Animated.View>

        {/* Goals Grid */}
        <View style={styles.goalsGrid}>
          {goals.map((goal, index) => {
            const isSelected = selectedGoals.includes(goal.id);
            return (
              <Animated.View 
                key={goal.id} 
                entering={FadeInUp.delay(150 + index * 50).springify()}
                style={styles.goalWrapper}
              >
                <TouchableOpacity
                  onPress={() => toggleGoal(goal.id)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={isSelected 
                      ? [goal.color, `${goal.color}99`] 
                      : ['#0f172a', '#0c1929']
                    }
                    style={[
                      styles.goalCard,
                      isSelected && styles.goalCardSelected,
                      { borderColor: isSelected ? goal.color : 'rgba(255,255,255,0.05)' }
                    ]}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <View style={[styles.checkBadge, { backgroundColor: 'white' }]}>
                        <Ionicons name="checkmark-outline" size={14} color={goal.color} />
                      </View>
                    )}
                    
                    {/* Icon */}
                    <View style={[
                      styles.goalIcon, 
                      { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : `${goal.color}20` }
                    ]}>
                      <Ionicons name={goal.icon} size={28} color={isSelected ? 'white' : goal.color} />
                    </View>
                    
                    {/* Content */}
                    <Text style={[styles.goalTitle, isSelected && styles.goalTitleSelected]}>
                      {goal.title}
                    </Text>
                    <Text style={[styles.goalDesc, isSelected && styles.goalDescSelected]}>
                      {goal.description}
                    </Text>
                    
                    {/* Benefits */}
                    <View style={styles.benefitsRow}>
                      {goal.benefits.slice(0, 2).map((benefit, i) => (
                        <View key={i} style={[
                          styles.benefitTag,
                          { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : `${goal.color}15` }
                        ]}>
                          <Text style={[
                            styles.benefitText,
                            { color: isSelected ? 'white' : goal.color }
                          ]}>
                            {benefit}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <Animated.View entering={FadeIn.delay(600)} style={styles.bottomCta}>
        <View style={styles.selectedCount}>
          <Text style={styles.selectedCountText}>
            {selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''} selected
          </Text>
        </View>
        <TouchableOpacity 
          onPress={handleContinue}
          disabled={selectedGoals.length === 0}
          style={{ flex: 1 }}
        >
          <LinearGradient 
            colors={selectedGoals.length > 0 ? ['#38bdf8', '#0ea5e9'] : ['#374151', '#1f2937']}
            style={styles.continueBtn}
          >
            <Text style={[
              styles.continueBtnText,
              selectedGoals.length === 0 && styles.continueBtnTextDisabled
            ]}>
              Continue
            </Text>
            <Ionicons 
              name="arrow-forward-outline" 
              size={20} 
              color={selectedGoals.length > 0 ? 'white' : '#6b7280'} 
            />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  content: { paddingHorizontal: 20, paddingBottom: 120 },
  hero: { alignItems: 'center', marginBottom: 24 },
  heroIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  heroTitle: { fontSize: 26, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  heroSubtitle: { fontSize: 15, color: '#9ca3af', textAlign: 'center', lineHeight: 22 },
  goalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  goalWrapper: { width: (width - 52) / 2 },
  goalCard: { borderRadius: 20, padding: 16, borderWidth: 2, minHeight: 180, position: 'relative' },
  goalCardSelected: { shadowColor: '#38bdf8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 },
  checkBadge: { position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  goalIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  goalTitle: { fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  goalTitleSelected: { color: 'white' },
  goalDesc: { fontSize: 12, color: '#9ca3af', marginBottom: 12, lineHeight: 16 },
  goalDescSelected: { color: 'rgba(255,255,255,0.8)' },
  benefitsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  benefitTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  benefitText: { fontSize: 10, fontWeight: '500' },
  bottomCta: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 20, paddingBottom: 36, backgroundColor: 'rgba(10,10,15,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  selectedCount: { backgroundColor: 'rgba(56,189,248,0.15)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  selectedCountText: { color: '#38bdf8', fontWeight: '600', fontSize: 13 },
  continueBtn: { borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  continueBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  continueBtnTextDisabled: { color: '#6b7280' },
});
