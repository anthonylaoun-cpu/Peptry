import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ScannerScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: 'face' | 'body' }>();
  const scanType = type || 'face';
  
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  const [facing, setFacing] = useState<CameraType>('front');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) { setImageUri(photo.uri); setCameraActive(false); }
    }
  };

  const startCamera = async () => {
    if (!permission?.granted) await requestPermission();
    if (permission?.granted) setCameraActive(true);
  };

  const analyzeImage = async () => {
    if (!imageUri) return;
    setIsProcessing(true);
    setTimeout(async () => {
      const results = generateMockResults(scanType);
      await AsyncStorage.setItem(`${scanType}Results`, JSON.stringify(results));
      setIsProcessing(false);
      router.push(`/results?type=${scanType}`);
    }, 3000);
  };

  const generateMockResults = (t: string) => {
    const baseScore = 6 + Math.random() * 2.5;
    const metrics = t === 'face' ? [
      { category: 'Jawline Definition', score: +(5.5 + Math.random() * 3).toFixed(1), description: 'Angular structure' },
      { category: 'Facial Symmetry', score: +(6 + Math.random() * 2.5).toFixed(1), description: 'Good balance' },
      { category: 'Skin Clarity', score: +(5.5 + Math.random() * 3).toFixed(1), description: 'Healthy texture' },
      { category: 'Eye Area', score: +(6 + Math.random() * 2.5).toFixed(1), description: 'Well-proportioned' },
      { category: 'Cheekbone Structure', score: +(5.5 + Math.random() * 3).toFixed(1), description: 'Moderate' },
    ] : [
      { category: 'Body Fat Range', score: +(5 + Math.random() * 3).toFixed(1), description: '14-18%' },
      { category: 'Muscle Definition', score: +(5.5 + Math.random() * 3).toFixed(1), description: 'Visible' },
      { category: 'Shoulder-Waist Ratio', score: +(6 + Math.random() * 2.5).toFixed(1), description: 'Good V-taper' },
      { category: 'Core Definition', score: +(5 + Math.random() * 3).toFixed(1), description: 'Foundation visible' },
    ];
    return { overallScore: +baseScore.toFixed(1), metrics, strengths: ['Good symmetry', 'Strong structure'], improvements: ['Definition', 'Texture'] };
  };

  if (cameraActive && permission?.granted) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}>
          <View style={{ flex: 1 }}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity onPress={() => setCameraActive(false)} style={styles.cameraButton}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFacing(facing === 'front' ? 'back' : 'front')} style={styles.cameraButton}>
                <Ionicons name="camera-reverse" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.cameraGuide}>
              <View style={[styles.cameraFrame, { width: scanType === 'face' ? 250 : 200, height: scanType === 'face' ? 320 : 400 }]} />
              <Text style={styles.cameraText}>Position your {scanType} within the frame</Text>
            </View>
            <View style={styles.captureArea}>
              <TouchableOpacity onPress={takePhoto} style={styles.captureButton}>
                <View style={styles.captureInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0a0a0f', '#12121a', '#0a0a0f']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="white" /></TouchableOpacity>
        <Text style={styles.headerTitle}>{scanType === 'face' ? 'Face Scanner' : 'Body Scanner'}</Text>
      </View>

      <View style={styles.content}>
        <Animated.Text entering={FadeInDown.delay(100).springify()} style={styles.instruction}>
          {scanType === 'face' ? 'Upload a clear front-facing selfie' : 'Upload a full-body photo'}
        </Animated.Text>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.uploadArea}>
          {!imageUri ? (
            <TouchableOpacity onPress={pickImage} style={styles.uploadBox}>
              <View style={styles.uploadIcon}><Ionicons name="cloud-upload-outline" size={40} color="#a855f7" /></View>
              <Text style={styles.uploadText}>Tap to upload image</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.previewContainer}>
              <Image source={{ uri: imageUri }} style={styles.preview} />
              {isProcessing && (
                <View style={styles.processingOverlay}>
                  <ActivityIndicator size="large" color="#a855f7" />
                  <Text style={styles.processingText}>Analyzing your {scanType}...</Text>
                </View>
              )}
              <TouchableOpacity onPress={() => setImageUri(null)} style={styles.clearButton}>
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.actions}>
          {!imageUri && (
            <TouchableOpacity onPress={startCamera} style={styles.secondaryButton}>
              <Ionicons name="camera-outline" size={22} color="white" />
              <Text style={styles.secondaryButtonText}>Use Camera</Text>
            </TouchableOpacity>
          )}
          {imageUri && !isProcessing && (
            <TouchableOpacity onPress={analyzeImage}>
              <LinearGradient colors={['#a855f7', '#7c3aed']} style={styles.primaryButton}>
                <Ionicons name="scan" size={22} color="white" />
                <Text style={styles.primaryButtonText}>Analyze {scanType === 'face' ? 'Face' : 'Body'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cameraContainer: { flex: 1, backgroundColor: 'black' },
  cameraHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 60 },
  cameraButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  cameraGuide: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cameraFrame: { borderWidth: 2, borderColor: '#a855f7', borderRadius: 24 },
  cameraText: { color: 'white', marginTop: 16, textAlign: 'center' },
  captureArea: { alignItems: 'center', paddingBottom: 48 },
  captureButton: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: 'white', alignItems: 'center', justifyContent: 'center' },
  captureInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 20, marginLeft: 16 },
  content: { flex: 1, paddingHorizontal: 24 },
  instruction: { color: '#9ca3af', textAlign: 'center', marginBottom: 32 },
  uploadArea: { flex: 1, maxHeight: 400 },
  uploadBox: { flex: 1, borderWidth: 2, borderStyle: 'dashed', borderColor: '#4b5563', borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  uploadIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(168,85,247,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  uploadText: { color: 'white', fontWeight: '500' },
  previewContainer: { flex: 1, borderRadius: 24, overflow: 'hidden', position: 'relative' },
  preview: { width: '100%', height: '100%' },
  processingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center' },
  processingText: { color: 'white', marginTop: 16 },
  clearButton: { position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  actions: { paddingVertical: 24, gap: 12 },
  secondaryButton: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { color: 'white', fontWeight: '600', marginLeft: 12 },
  primaryButton: { borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 12 },
});
