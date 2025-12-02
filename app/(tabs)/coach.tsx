import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import HeaderWithMenu from '../../components/HeaderWithMenu';

const articles = [
  { title: 'Peptides 101: A Complete Guide', category: 'Education', icon: 'book-outline' },
  { title: 'Optimizing Your Jawline', category: 'Face', icon: 'person-outline' },
  { title: 'Body Recomposition Basics', category: 'Body', icon: 'fitness-outline' },
  { title: 'Skin Health & Peptides', category: 'Skin', icon: 'leaf-outline' },
];

export default function CoachTab() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: "Hi! I'm your LooksMax AI Coach. Ask me anything about peptides, training, or maximizing your results." }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setChat(prev => [...prev, { role: 'user', text: message }]);
    setMessage('');
    // Simulate AI response
    setTimeout(() => {
      setChat(prev => [...prev, { role: 'ai', text: "That's a great question! Based on your goals and scan results, I'd recommend focusing on consistent protocols and tracking your progress over time." }]);
    }, 1000);
  };

  return (
    <LinearGradient colors={['#071018', '#0c1929', '#071018']} style={styles.container}>
      <HeaderWithMenu title="AI Coach" />

      <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
        {chat.map((msg, i) => (
          <Animated.View key={i} entering={FadeInDown.delay(i * 100).springify()} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
            {msg.role === 'ai' && <View style={styles.aiIcon}><Ionicons name="star" size={16} color="#38bdf8" /></View>}
            <Text style={styles.bubbleText}>{msg.text}</Text>
          </Animated.View>
        ))}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          placeholder="Ask your coach..."
          placeholderTextColor="#6b7280"
          value={message}
          onChangeText={setMessage}
          style={styles.input}
          multiline
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
          <Ionicons name="send-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.articlesSection}>
        <Text style={styles.sectionTitle}>Articles</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {articles.map((article, i) => (
            <TouchableOpacity key={i} style={styles.articleCard}>
              <View style={styles.articleIcon}><Ionicons name={article.icon as any} size={24} color="#38bdf8" /></View>
              <Text style={styles.articleCategory}>{article.category}</Text>
              <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chatArea: { flex: 1, paddingHorizontal: 24 },
  chatContent: { paddingBottom: 16 },
  bubble: { maxWidth: '85%', padding: 16, borderRadius: 20, marginBottom: 12 },
  userBubble: { backgroundColor: '#0ea5e9', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'flex-start', borderBottomLeftRadius: 4, flexDirection: 'row', alignItems: 'flex-start' },
  aiIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(56,189,248,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  bubbleText: { color: 'white', fontSize: 15, lineHeight: 22, flex: 1 },
  inputArea: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#0c1929' },
  input: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24, paddingHorizontal: 20, paddingVertical: 12, color: 'white', fontSize: 16, maxHeight: 100 },
  sendBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#38bdf8', alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  articlesSection: { padding: 24, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: 'white', marginBottom: 16 },
  articleCard: { width: 160, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 16, marginRight: 12 },
  articleIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(56,189,248,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  articleCategory: { color: '#38bdf8', fontSize: 12, marginBottom: 4 },
  articleTitle: { color: 'white', fontSize: 14, fontWeight: '500' },
});
