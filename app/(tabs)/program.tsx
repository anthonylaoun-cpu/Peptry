import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const peptides = [
  { name: 'BPC-157', category: 'Recovery', icon: 'fitness', benefits: ['Tissue repair', 'Gut healing', 'Anti-inflammatory'] },
  { name: 'TB-500', category: 'Recovery', icon: 'heart', benefits: ['Wound healing', 'Flexibility', 'Hair growth'] },
  { name: 'GHK-Cu', category: 'Skin', icon: 'sparkles', benefits: ['Collagen boost', 'Skin elasticity', 'Anti-aging'] },
  { name: 'Epithalon', category: 'Longevity', icon: 'time', benefits: ['Telomere extension', 'Sleep quality', 'Immune support'] },
];

export default function ProgramTab() {
  return (
    <LinearGradient colors={['#0a0a0f', '#12121a', '#0a0a0f']} style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Peptide Program</Text>
          <Text style={styles.headerSubtitle}>Personalized for your goals</Text>
        </View>

        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.section}>
          <LinearGradient colors={['rgba(168,85,247,0.2)', 'rgba(124,58,237,0.1)']} style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="flask" size={32} color="#a855f7" />
            </View>
            <Text style={styles.summaryTitle}>Your Protocol</Text>
            <Text style={styles.summaryText}>Based on your scans and goals, here are your recommended peptides</Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Peptides</Text>
          {peptides.map((peptide, index) => (
            <Animated.View key={peptide.name} entering={FadeInUp.delay(250 + index * 50).springify()}>
              <TouchableOpacity style={styles.peptideCard}>
                <View style={styles.peptideIcon}>
                  <Ionicons name={peptide.icon as any} size={24} color="#a855f7" />
                </View>
                <View style={styles.peptideContent}>
                  <View style={styles.peptideHeader}>
                    <Text style={styles.peptideName}>{peptide.name}</Text>
                    <View style={styles.categoryBadge}><Text style={styles.categoryText}>{peptide.category}</Text></View>
                  </View>
                  <View style={styles.benefitsList}>
                    {peptide.benefits.map((b, i) => (
                      <View key={i} style={styles.benefitItem}>
                        <Ionicons name="checkmark" size={14} color="#22c55e" />
                        <Text style={styles.benefitText}>{b}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        <View style={styles.disclaimer}>
          <Ionicons name="information-circle" size={16} color="#6b7280" />
          <Text style={styles.disclaimerText}>Educational purposes only. Consult a healthcare professional.</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { color: '#9ca3af', marginTop: 4 },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: 'white', marginBottom: 16 },
  summaryCard: { borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(168,85,247,0.3)' },
  summaryIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(168,85,247,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  summaryTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  summaryText: { color: '#9ca3af', textAlign: 'center' },
  peptideCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16, marginBottom: 12 },
  peptideIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(168,85,247,0.2)', alignItems: 'center', justifyContent: 'center' },
  peptideContent: { flex: 1, marginLeft: 16 },
  peptideHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  peptideName: { fontSize: 16, fontWeight: '600', color: 'white' },
  categoryBadge: { backgroundColor: 'rgba(168,85,247,0.2)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
  categoryText: { color: '#a855f7', fontSize: 12 },
  benefitsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  benefitText: { color: '#9ca3af', fontSize: 12 },
  disclaimer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 8 },
  disclaimerText: { color: '#6b7280', fontSize: 12 },
});
