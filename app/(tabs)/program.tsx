import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import HeaderWithMenu from '../../components/HeaderWithMenu';

const peptides = [
  { name: 'BPC-157', category: 'Recovery', icon: 'fitness-outline', benefits: ['Tissue repair', 'Gut healing', 'Anti-inflammatory'] },
  { name: 'TB-500', category: 'Recovery', icon: 'heart-outline', benefits: ['Wound healing', 'Flexibility', 'Hair growth'] },
  { name: 'GHK-Cu', category: 'Skin', icon: 'leaf-outline', benefits: ['Collagen boost', 'Skin elasticity', 'Anti-aging'] },
  { name: 'Epithalon', category: 'Longevity', icon: 'time-outline', benefits: ['Telomere extension', 'Sleep quality', 'Immune support'] },
];

export default function ProgramTab() {
  return (
    <LinearGradient colors={['#071018', '#0c1929', '#071018']} style={styles.container}>
      <HeaderWithMenu title="Extras" />
      <ScrollView>
        <View style={styles.subtitleRow}>
          <Text style={styles.headerSubtitle}>Personalized for your goals</Text>
        </View>

        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.section}>
          <LinearGradient colors={['rgba(56,189,248,0.2)', 'rgba(14,165,233,0.1)']} style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="flask-outline" size={32} color="#38bdf8" />
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
                  <Ionicons name={peptide.icon as any} size={24} color="#38bdf8" />
                </View>
                <View style={styles.peptideContent}>
                  <View style={styles.peptideHeader}>
                    <Text style={styles.peptideName}>{peptide.name}</Text>
                    <View style={styles.categoryBadge}><Text style={styles.categoryText}>{peptide.category}</Text></View>
                  </View>
                  <View style={styles.benefitsList}>
                    {peptide.benefits.map((b, i) => (
                      <View key={i} style={styles.benefitItem}>
                        <Ionicons name="checkmark-outline" size={14} color="#22c55e" />
                        <Text style={styles.benefitText}>{b}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <Ionicons name="chevron-forward-outline" size={20} color="#6b7280" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={16} color="#6b7280" />
          <Text style={styles.disclaimerText}>Educational purposes only. Consult a healthcare professional.</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  subtitleRow: { paddingHorizontal: 24, paddingBottom: 16 },
  headerSubtitle: { color: '#9ca3af' },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: 'white', marginBottom: 16 },
  summaryCard: { borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(56,189,248,0.3)' },
  summaryIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(56,189,248,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  summaryTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  summaryText: { color: '#9ca3af', textAlign: 'center' },
  peptideCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16, marginBottom: 12 },
  peptideIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(56,189,248,0.2)', alignItems: 'center', justifyContent: 'center' },
  peptideContent: { flex: 1, marginLeft: 16 },
  peptideHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  peptideName: { fontSize: 16, fontWeight: '600', color: 'white' },
  categoryBadge: { backgroundColor: 'rgba(56,189,248,0.2)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
  categoryText: { color: '#38bdf8', fontSize: 12 },
  benefitsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  benefitText: { color: '#9ca3af', fontSize: 12 },
  disclaimer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 8 },
  disclaimerText: { color: '#6b7280', fontSize: 12 },
});
