import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const defaultPeptides = [
  { id: '1', name: 'BPC-157', dosage: '250mcg', time: 'Morning' },
  { id: '2', name: 'TB-500', dosage: '2.5mg', time: 'Morning' },
  { id: '3', name: 'GHK-Cu', dosage: '1mg', time: 'Evening' },
];

export default function TrackerTab() {
  const [taken, setTaken] = useState<string[]>([]);
  const [peptides] = useState(defaultPeptides);

  const toggleTaken = (id: string) => {
    setTaken(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const progress = (taken.length / peptides.length) * 100;

  return (
    <LinearGradient colors={['#0a0a0f', '#12121a', '#0a0a0f']} style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Daily Tracker</Text>
          <Text style={styles.headerDate}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        </View>

        {/* Progress Card */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.progressCard}>
          <LinearGradient colors={['rgba(168,85,247,0.2)', 'rgba(124,58,237,0.1)']} style={styles.progressGradient}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Today's Progress</Text>
              <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <LinearGradient colors={['#a855f7', '#7c3aed']} style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{taken.length} of {peptides.length} peptides taken</Text>
          </LinearGradient>
        </Animated.View>

        {/* Peptide List */}
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Your Peptides</Text>
          {peptides.map((peptide, index) => (
            <TouchableOpacity key={peptide.id} onPress={() => toggleTaken(peptide.id)} style={styles.peptideCard}>
              <View style={[styles.checkbox, taken.includes(peptide.id) && styles.checkboxChecked]}>
                {taken.includes(peptide.id) && <Ionicons name="checkmark" size={18} color="white" />}
              </View>
              <View style={styles.peptideInfo}>
                <Text style={[styles.peptideName, taken.includes(peptide.id) && styles.peptideNameTaken]}>{peptide.name}</Text>
                <Text style={styles.peptideDetails}>{peptide.dosage} • {peptide.time}</Text>
              </View>
              {taken.includes(peptide.id) && <View style={styles.takenBadge}><Text style={styles.takenText}>Taken</Text></View>}
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Add New */}
        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.section}>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={24} color="#a855f7" />
            <Text style={styles.addText}>Add Peptide to Track</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  headerDate: { color: '#9ca3af', marginTop: 4 },
  progressCard: { paddingHorizontal: 24, marginBottom: 24 },
  progressGradient: { borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(168,85,247,0.3)' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  progressTitle: { color: 'white', fontSize: 18, fontWeight: '600' },
  progressPercent: { color: '#a855f7', fontSize: 24, fontWeight: 'bold' },
  progressBarBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: 8, borderRadius: 4 },
  progressText: { color: '#9ca3af', marginTop: 12, textAlign: 'center' },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: 'white', marginBottom: 16 },
  peptideCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16, marginBottom: 12 },
  checkbox: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#6b7280', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  peptideInfo: { flex: 1, marginLeft: 16 },
  peptideName: { color: 'white', fontSize: 16, fontWeight: '600' },
  peptideNameTaken: { textDecorationLine: 'line-through', opacity: 0.6 },
  peptideDetails: { color: '#9ca3af', fontSize: 14, marginTop: 2 },
  takenBadge: { backgroundColor: 'rgba(34,197,94,0.2)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  takenText: { color: '#22c55e', fontSize: 12, fontWeight: '600' },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16, borderWidth: 1, borderStyle: 'dashed', borderColor: '#a855f7' },
  addText: { color: '#a855f7', fontSize: 16, marginLeft: 8 },
});
