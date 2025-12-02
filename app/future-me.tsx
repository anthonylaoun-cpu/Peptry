import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, FadeIn, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPremiumStatus, getFaceResults } from '../utils/userData';

const { width } = Dimensions.get('window');

const RAPIDAPI_KEY = 'ff700fd992msh4f7c66bc27e252cp188becjsnc3849fb03f45';

interface TimeOption {
  id: string;
  label: string;
  months: number;
  description: string;
}

const timeOptions: TimeOption[] = [
  { id: '1month', label: '1 Month', months: 1, description: 'Early improvements' },
  { id: '3months', label: '3 Months', months: 3, description: 'Noticeable changes' },
  { id: '6months', label: '6 Months', months: 6, description: 'Full transformation' },
];

// Generate future face image using AI
async function generateFutureImage(originalImage: string, months: number, faceResults: any): Promise<string> {
  try {
    // Create a detailed prompt based on the user's face analysis and goals
    const improvements = [];
    
    if (faceResults) {
      if (faceResults.skinQuality < 7) improvements.push('clearer and more radiant skin');
      if (faceResults.jawline < 7) improvements.push('more defined jawline');
      if (faceResults.cheekbones < 7) improvements.push('more prominent cheekbones');
      if (faceResults.eyeArea < 7) improvements.push('brighter more youthful eyes');
    }
    
    const intensityWord = months === 1 ? 'slightly' : months === 3 ? 'noticeably' : 'significantly';
    const improvementText = improvements.length > 0 
      ? improvements.join(', ')
      : 'enhanced facial features and skin quality';
    
    const prompt = `Photorealistic portrait of an attractive person with ${intensityWord} improved ${improvementText}, healthy glowing skin, good lighting, professional photo, high quality, after ${months} months of skincare and wellness routine`;
    
    console.log('Generating image with prompt:', prompt);
    
    const response = await fetch(
      `https://ai-image-generator16.p.rapidapi.com/generate-image?prompt=${encodeURIComponent(prompt)}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'ai-image-generator16.p.rapidapi.com',
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
      }
    );

    console.log('Image generation response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Image generation error:', errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Image generation response:', JSON.stringify(data).substring(0, 200));
    
    // Handle different response formats
    if (data.image_url) return data.image_url;
    if (data.url) return data.url;
    if (data.image) return data.image;
    if (data.data?.url) return data.data.url;
    if (data.result) return data.result;
    if (typeof data === 'string' && data.startsWith('http')) return data;
    
    throw new Error('Could not find image URL in response');
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
}

// Loading animation component
function LoadingAnimation() {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 3000, easing: Easing.linear }), -1);
    scale.value = withRepeat(
      withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.loadingIcon, animatedStyle]}>
      <LinearGradient colors={['#38bdf8', '#0284c7', '#3b82f6']} style={styles.loadingGradient}>
        <Ionicons name="star" size={40} color="white" />
      </LinearGradient>
    </Animated.View>
  );
}

export default function FutureMeScreen() {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [faceResults, setFaceResults] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [premium, results, images] = await Promise.all([
      getPremiumStatus(),
      getFaceResults(),
      AsyncStorage.getItem('faceImages'),
    ]);
    
    setIsPremium(premium.isPremium);
    setFaceResults(results);
    
    if (images) {
      const parsed = JSON.parse(images);
      setOriginalImage(parsed.front);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTime || !originalImage) return;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    
    try {
      const months = timeOptions.find(t => t.id === selectedTime)?.months || 3;
      const imageUrl = await generateFutureImage(originalImage, months, faceResults);
      setGeneratedImage(imageUrl);
    } catch (err: any) {
      console.error('Generation failed:', err);
      setError('Image generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedOption = timeOptions.find(t => t.id === selectedTime);

  return (
    <LinearGradient colors={['#071018', '#0c1929', '#071018']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Future Me</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.hero}>
          <LinearGradient colors={['#0284c7', '#22d3ee', '#38bdf8']} style={styles.heroIconBg}>
            <Ionicons name="time-outline" size={36} color="white" />
          </LinearGradient>
          <Text style={styles.heroTitle}>See Your Future Self</Text>
          <Text style={styles.heroSubtitle}>
            AI-powered visualization of your potential after using your personalized peptide protocol
          </Text>
        </Animated.View>

        {/* Time Selection */}
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.timeSection}>
          <Text style={styles.sectionTitle}>Select Timeframe</Text>
          <View style={styles.timeOptions}>
            {timeOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => setSelectedTime(option.id)}
                style={styles.timeOptionWrapper}
              >
                <LinearGradient
                  colors={selectedTime === option.id 
                    ? ['#38bdf8', '#0ea5e9'] 
                    : ['#0f172a', '#0c1929']
                  }
                  style={[
                    styles.timeOption,
                    selectedTime === option.id && styles.timeOptionSelected
                  ]}
                >
                  <Text style={[
                    styles.timeLabel,
                    selectedTime === option.id && styles.timeLabelSelected
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={[
                    styles.timeDesc,
                    selectedTime === option.id && styles.timeDescSelected
                  ]}>
                    {option.description}
                  </Text>
                  {selectedTime === option.id && (
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark-circle" size={20} color="white" />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Preview Area */}
        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.previewSection}>
          {isGenerating ? (
            <View style={styles.generatingContainer}>
              <LoadingAnimation />
              <Text style={styles.generatingTitle}>Generating Your Future...</Text>
              <Text style={styles.generatingSubtitle}>
                AI is visualizing your {selectedOption?.label} transformation
              </Text>
              <View style={styles.progressBar}>
                <Animated.View style={styles.progressFill} />
              </View>
            </View>
          ) : generatedImage ? (
            <View style={styles.resultContainer}>
              {/* Comparison Toggle */}
              <View style={styles.comparisonToggle}>
                <TouchableOpacity 
                  onPress={() => setShowComparison(false)}
                  style={[styles.toggleBtn, !showComparison && styles.toggleBtnActive]}
                >
                  <Text style={[styles.toggleText, !showComparison && styles.toggleTextActive]}>
                    Future
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setShowComparison(true)}
                  style={[styles.toggleBtn, showComparison && styles.toggleBtnActive]}
                >
                  <Text style={[styles.toggleText, showComparison && styles.toggleTextActive]}>
                    Compare
                  </Text>
                </TouchableOpacity>
              </View>

              {showComparison ? (
                <View style={styles.comparisonView}>
                  <View style={styles.compareImage}>
                    <Text style={styles.compareLabel}>Now</Text>
                    {originalImage && (
                      <Image source={{ uri: originalImage }} style={styles.compareImg} />
                    )}
                  </View>
                  <View style={styles.compareArrow}>
                    <Ionicons name="arrow-forward-outline" size={24} color="#38bdf8" />
                  </View>
                  <View style={styles.compareImage}>
                    <Text style={styles.compareLabel}>{selectedOption?.label}</Text>
                    <Image source={{ uri: generatedImage }} style={styles.compareImg} />
                  </View>
                </View>
              ) : (
                <View style={styles.singleImageView}>
                  <Image source={{ uri: generatedImage }} style={styles.generatedImage} />
                  <View style={styles.imageBadge}>
                    <Ionicons name="star" size={14} color="#fbbf24" />
                    <Text style={styles.imageBadgeText}>After {selectedOption?.label}</Text>
                  </View>
                </View>
              )}

              {/* Improvements List */}
              <View style={styles.improvementsList}>
                <Text style={styles.improvementsTitle}>Expected Improvements</Text>
                {faceResults && (
                  <>
                    {faceResults.skinQuality < 7 && (
                      <View style={styles.improvementItem}>
                        <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                        <Text style={styles.improvementText}>Clearer, more radiant skin</Text>
                      </View>
                    )}
                    {faceResults.jawline < 7 && (
                      <View style={styles.improvementItem}>
                        <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                        <Text style={styles.improvementText}>More defined jawline</Text>
                      </View>
                    )}
                    <View style={styles.improvementItem}>
                      <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                      <Text style={styles.improvementText}>Reduced signs of aging</Text>
                    </View>
                    <View style={styles.improvementItem}>
                      <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                      <Text style={styles.improvementText}>Enhanced facial symmetry</Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <View style={styles.placeholderBox}>
                <Ionicons name="image-outline" size={64} color="#4b5563" />
                <Text style={styles.placeholderText}>
                  Select a timeframe and generate your future transformation
                </Text>
              </View>
            </View>
          )}

          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={20} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCta}>
        {!isPremium ? (
          <TouchableOpacity onPress={() => router.push('/paywall')} style={{ flex: 1 }}>
            <LinearGradient colors={['#38bdf8', '#0ea5e9']} style={styles.generateBtn}>
              <Ionicons name="lock-closed-outline" size={20} color="white" />
              <Text style={styles.generateBtnText}>Unlock Future Me</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : generatedImage ? (
          <TouchableOpacity onPress={handleGenerate} style={{ flex: 1 }}>
            <LinearGradient colors={['#0284c7', '#22d3ee']} style={styles.generateBtn}>
              <Ionicons name="refresh-outline" size={20} color="white" />
              <Text style={styles.generateBtnText}>Generate Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={handleGenerate} 
            disabled={!selectedTime || isGenerating}
            style={{ flex: 1 }}
          >
            <LinearGradient 
              colors={selectedTime && !isGenerating ? ['#38bdf8', '#0ea5e9'] : ['#374151', '#1f2937']} 
              style={styles.generateBtn}
            >
              <Ionicons name="star" size={20} color={selectedTime ? 'white' : '#6b7280'} />
              <Text style={[styles.generateBtnText, !selectedTime && styles.generateBtnTextDisabled]}>
                {isGenerating ? 'Generating...' : 'Generate Future Me'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  content: { paddingHorizontal: 20, paddingBottom: 120 },
  hero: { alignItems: 'center', marginBottom: 28 },
  heroIconBg: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  heroTitle: { fontSize: 26, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: '#9ca3af', textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },
  timeSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: 'white', marginBottom: 12 },
  timeOptions: { flexDirection: 'row', gap: 10 },
  timeOptionWrapper: { flex: 1 },
  timeOption: { borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', position: 'relative' },
  timeOptionSelected: { borderColor: '#38bdf8' },
  timeLabel: { fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  timeLabelSelected: { color: 'white' },
  timeDesc: { fontSize: 11, color: '#6b7280', textAlign: 'center' },
  timeDescSelected: { color: 'rgba(255,255,255,0.8)' },
  checkIcon: { position: 'absolute', top: 8, right: 8 },
  previewSection: { flex: 1 },
  generatingContainer: { alignItems: 'center', paddingVertical: 60 },
  loadingIcon: { marginBottom: 24 },
  loadingGradient: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  generatingTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  generatingSubtitle: { fontSize: 14, color: '#9ca3af', textAlign: 'center' },
  progressBar: { width: 200, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 24, overflow: 'hidden' },
  progressFill: { height: '100%', width: '60%', backgroundColor: '#38bdf8', borderRadius: 2 },
  resultContainer: { alignItems: 'center' },
  comparisonToggle: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4, marginBottom: 16 },
  toggleBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  toggleBtnActive: { backgroundColor: '#38bdf8' },
  toggleText: { color: '#6b7280', fontWeight: '600' },
  toggleTextActive: { color: 'white' },
  comparisonView: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  compareImage: { flex: 1, alignItems: 'center' },
  compareLabel: { color: '#9ca3af', fontSize: 12, marginBottom: 8 },
  compareImg: { width: (width - 80) / 2, height: (width - 80) / 2 * 1.2, borderRadius: 16 },
  compareArrow: { padding: 8 },
  singleImageView: { position: 'relative' },
  generatedImage: { width: width - 40, height: (width - 40) * 1.1, borderRadius: 24 },
  imageBadge: { position: 'absolute', bottom: 16, left: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  imageBadgeText: { color: 'white', fontSize: 12, fontWeight: '600' },
  improvementsList: { marginTop: 24, width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16 },
  improvementsTitle: { fontSize: 14, fontWeight: '600', color: 'white', marginBottom: 12 },
  improvementItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  improvementText: { color: '#d1d5db', fontSize: 14 },
  placeholderContainer: { paddingVertical: 40 },
  placeholderBox: { borderWidth: 2, borderStyle: 'dashed', borderColor: '#374151', borderRadius: 24, padding: 40, alignItems: 'center' },
  placeholderText: { color: '#6b7280', fontSize: 14, textAlign: 'center', marginTop: 16, lineHeight: 20 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(239,68,68,0.1)', padding: 12, borderRadius: 12, marginTop: 16 },
  errorText: { color: '#ef4444', fontSize: 13 },
  bottomCta: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingVertical: 20, paddingBottom: 36, backgroundColor: 'rgba(10,10,15,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  generateBtn: { borderRadius: 16, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  generateBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  generateBtnTextDisabled: { color: '#6b7280' },
});
