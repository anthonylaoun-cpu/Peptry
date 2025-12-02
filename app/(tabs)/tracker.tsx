import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import HeaderWithMenu from '../../components/HeaderWithMenu';

const defaultPeptides = [
  { id: '1', name: 'BPC-157', dosage: '250mcg', time: 'Morning' },
  { id: '2', name: 'TB-500', dosage: '2.5mg', time: 'Morning' },
  { id: '3', name: 'GHK-Cu', dosage: '1mg', time: 'Evening' },
];

export default function TrackerTab() {
  const [taken, setTaken] = useState<string[]>([]);
  const [peptides, setPeptides] = useState(defaultPeptides);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPeptide, setNewPeptide] = useState({ name: '', dosage: '', time: 'Morning' });

  const addPeptide = () => {
    if (newPeptide.name && newPeptide.dosage) {
      const id = Date.now().toString();
      setPeptides([...peptides, { id, ...newPeptide }]);
      setNewPeptide({ name: '', dosage: '', time: 'Morning' });
      setShowAddModal(false);
    }
  };

  const toggleTaken = (id: string) => {
    setTaken(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const progress = (taken.length / peptides.length) * 100;

  return (
    <LinearGradient colors={['#071018', '#0c1929', '#071018']} style={styles.container}>
      <HeaderWithMenu title="Daily Tracker" />
      <ScrollView>
        <View style={styles.dateRow}>
          <Text style={styles.headerDate}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        </View>

        {/* Progress Card */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.progressCard}>
          <LinearGradient colors={['rgba(56,189,248,0.2)', 'rgba(14,165,233,0.1)']} style={styles.progressGradient}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Today's Progress</Text>
              <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={[styles.progressBarFill, { width: `${progress}%` }]} />
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
                {taken.includes(peptide.id) && <Ionicons name="checkmark-outline" size={18} color="white" />}
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
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
            <Ionicons name="add-circle-outline" size={24} color="#38bdf8" />
            <Text style={styles.addText}>Add Peptide to Track</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Peptide Modal */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Peptide</Text>
            <TextInput
              style={styles.input}
              placeholder="Peptide name (e.g., BPC-157)"
              placeholderTextColor="#6b7280"
              value={newPeptide.name}
              onChangeText={(text) => setNewPeptide({...newPeptide, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Dosage (e.g., 250mcg)"
              placeholderTextColor="#6b7280"
              value={newPeptide.dosage}
              onChangeText={(text) => setNewPeptide({...newPeptide, dosage: text})}
            />
            <View style={styles.timeButtons}>
              {['Morning', 'Evening'].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[styles.timeBtn, newPeptide.time === time && styles.timeBtnActive]}
                  onPress={() => setNewPeptide({...newPeptide, time})}
                >
                  <Text style={[styles.timeBtnText, newPeptide.time === time && styles.timeBtnTextActive]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={addPeptide}>
                <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={styles.saveBtnGradient}>
                  <Text style={styles.saveText}>Add Peptide</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  dateRow: { paddingHorizontal: 24, paddingBottom: 16 },
  headerDate: { color: '#9ca3af' },
  progressCard: { paddingHorizontal: 24, marginBottom: 24 },
  progressGradient: { borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(56,189,248,0.3)' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  progressTitle: { color: 'white', fontSize: 18, fontWeight: '600' },
  progressPercent: { color: '#38bdf8', fontSize: 24, fontWeight: 'bold' },
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
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16, borderWidth: 1, borderStyle: 'dashed', borderColor: '#38bdf8' },
  addText: { color: '#38bdf8', fontSize: 16, marginLeft: 8 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', paddingHorizontal: 24 },
  modalContent: { backgroundColor: '#0c1929', borderRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, color: 'white', fontSize: 16, marginBottom: 12 },
  timeButtons: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  timeBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center' },
  timeBtnActive: { backgroundColor: 'rgba(56,189,248,0.2)', borderWidth: 1, borderColor: '#38bdf8' },
  timeBtnText: { color: '#9ca3af', fontWeight: '600' },
  timeBtnTextActive: { color: '#38bdf8' },
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, padding: 16, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center' },
  cancelText: { color: 'white', fontWeight: '600', fontSize: 16 },
  saveBtn: { flex: 1 },
  saveBtnGradient: { padding: 16, borderRadius: 30, alignItems: 'center' },
  saveText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
