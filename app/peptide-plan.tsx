import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { getFaceResults, getPremiumStatus } from '../utils/userData';
import { generatePeptidePlan, PeptidePlan, PeptideRecommendation } from '../utils/peptideRecommendations';

const { width } = Dimensions.get('window');

const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
  sparkles: 'sparkles',
  fitness: 'fitness',
  medkit: 'medkit',
  hourglass: 'hourglass-outline',
  leaf: 'leaf',
  water: 'water',
  flame: 'flame',
  barbell: 'barbell',
  body: 'body',
};

function PeptideCard({ peptide, index }: { peptide: PeptideRecommendation; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const iconName = iconMap[peptide.icon] || 'flask';

  return (
    <Animated.View entering={FadeInUp.delay(200 + index * 100).springify()}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} activeOpacity={0.9}>
        <LinearGradient
          colors={['#0f172a', '#0c1929']}
          style={styles.peptideCard}
        >
          {/* Header */}
          <View style={styles.peptideHeader}>
            <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={styles.peptideIcon}>
              <Ionicons name={iconName} size={24} color="white" />
            </LinearGradient>
            <View style={styles.peptideInfo}>
              <Text style={styles.peptideName}>{peptide.name}</Text>
              <Text style={styles.peptidePurpose}>{peptide.purpose}</Text>
            </View>
            <Ionicons 
              name={expanded ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#6b7280" 
            />
          </View>

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            <View style={styles.quickItem}>
              <Ionicons name="flask-outline" size={14} color="#38bdf8" />
              <Text style={styles.quickText}>{peptide.dosage}</Text>
            </View>
            <View style={styles.quickItem}>
              <Ionicons name="repeat-outline" size={14} color="#22c55e" />
              <Text style={styles.quickText}>{peptide.frequency}</Text>
            </View>
            <View style={styles.quickItem}>
              <Ionicons name="time-outline" size={14} color="#f97316" />
              <Text style={styles.quickText}>{peptide.duration}</Text>
            </View>
          </View>

          {/* Expanded Content */}
          {expanded && (
            <Animated.View entering={FadeIn.duration(300)} style={styles.expandedContent}>
              {/* Weekly Schedule */}
              <Text style={styles.sectionTitle}>Weekly Schedule</Text>
              <View style={styles.scheduleRow}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <View 
                    key={day} 
                    style={[
                      styles.dayBubble,
                      peptide.weeklySchedule.includes(day) && styles.dayBubbleActive
                    ]}
                  >
                    <Text style={[
                      styles.dayText,
                      peptide.weeklySchedule.includes(day) && styles.dayTextActive
                    ]}>
                      {day.charAt(0)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Benefits */}
              <Text style={styles.sectionTitle}>Benefits</Text>
              <View style={styles.benefitsList}>
                {peptide.benefits.map((benefit, i) => (
                  <View key={i} style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function PeptidePlanScreen() {
  const router = useRouter();
  const [plan, setPlan] = useState<PeptidePlan | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [results, premiumStatus] = await Promise.all([
        getFaceResults(),
        getPremiumStatus(),
      ]);
      setIsPremium(premiumStatus.isPremium);
      
      if (results) {
        const peptidePlan = generatePeptidePlan(results);
        setPlan(peptidePlan);
      }
    };
    loadData();
  }, []);

  return (
    <LinearGradient colors={['#071018', '#0c1929', '#071018']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Program</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.heroSection}>
          <LinearGradient colors={['rgba(56,189,248,0.2)', 'rgba(14,165,233,0.1)']} style={styles.heroBg}>
            <View style={styles.heroIconContainer}>
              <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={styles.heroIcon}>
                <Ionicons name="flask-outline" size={40} color="white" />
              </LinearGradient>
              <View style={styles.heroSparkle}>
                <Ionicons name="star" size={14} color="#fbbf24" />
              </View>
            </View>
            <Text style={styles.heroTitle}>{plan?.title || 'Your Peptide Plan'}</Text>
            <Text style={styles.heroSubtitle}>{plan?.description || 'Loading your personalized recommendations...'}</Text>
            
            {plan && (
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{plan.peptides.length}</Text>
                  <Text style={styles.statLabel}>Peptides</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{plan.totalWeeklyDoses}</Text>
                  <Text style={styles.statLabel}>Weekly Doses</Text>
                </View>
              </View>
            )}
          </LinearGradient>
        </Animated.View>

        {/* Peptide Cards */}
        {plan?.peptides.map((peptide, index) => (
          <PeptideCard key={peptide.name} peptide={peptide} index={index} />
        ))}

        {/* Disclaimer */}
        <Animated.View entering={FadeInUp.delay(800).springify()} style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={20} color="#6b7280" />
          <Text style={styles.disclaimerText}>
            This is for informational purposes only. Always consult a healthcare professional before starting any peptide protocol.
          </Text>
        </Animated.View>

        {/* Premium CTA */}
        {!isPremium && (
          <Animated.View entering={FadeInUp.delay(900).springify()}>
            <TouchableOpacity onPress={() => router.push('/paywall')}>
              <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={styles.premiumCta}>
                <Ionicons name="diamond-outline" size={24} color="white" />
                <View style={styles.premiumCtaText}>
                  <Text style={styles.premiumCtaTitle}>Unlock Full Program</Text>
                  <Text style={styles.premiumCtaSubtitle}>Get detailed dosing schedules & tracking</Text>
                </View>
                <Ionicons name="arrow-forward-outline" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  // Hero
  heroSection: { marginBottom: 24 },
  heroBg: { borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(56,189,248,0.2)' },
  heroIconContainer: { position: 'relative', marginBottom: 16 },
  heroIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  heroSparkle: { position: 'absolute', top: -4, right: -4, width: 28, height: 28, borderRadius: 14, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: '#9ca3af', textAlign: 'center', lineHeight: 20 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 24 },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  statLabel: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 16 },
  // Peptide Card
  peptideCard: { borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  peptideHeader: { flexDirection: 'row', alignItems: 'center' },
  peptideIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  peptideInfo: { flex: 1, marginLeft: 12 },
  peptideName: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  peptidePurpose: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  quickInfo: { flexDirection: 'row', marginTop: 12, gap: 12 },
  quickItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 4 },
  quickText: { fontSize: 11, color: '#d1d5db' },
  expandedContent: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#9ca3af', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  scheduleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  dayBubble: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  dayBubbleActive: { backgroundColor: '#38bdf8' },
  dayText: { fontSize: 12, fontWeight: '600', color: '#6b7280' },
  dayTextActive: { color: 'white' },
  benefitsList: { gap: 8 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  benefitText: { fontSize: 14, color: '#d1d5db' },
  // Disclaimer
  disclaimer: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 14, marginTop: 8, marginBottom: 16 },
  disclaimerText: { flex: 1, fontSize: 12, color: '#6b7280', lineHeight: 18 },
  // Premium CTA
  premiumCta: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, gap: 12 },
  premiumCtaText: { flex: 1 },
  premiumCtaTitle: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  premiumCtaSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
});
