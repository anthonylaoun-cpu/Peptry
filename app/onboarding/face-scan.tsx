import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FaceScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [step, setStep] = useState<1 | 2>(1);
  const [cameraActive, setCameraActive] = useState(false);
  const [facing, setFacing] = useState<CameraType>('front');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [sideImage, setSideImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const currentImage = step === 1 ? frontImage : sideImage;
  const setCurrentImage = step === 1 ? setFrontImage : setSideImage;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
    if (!result.canceled) setCurrentImage(result.assets[0].uri);
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) { setCurrentImage(photo.uri); setCameraActive(false); }
    }
  };

  const startCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (result.granted) setCameraActive(true);
    } else {
      setCameraActive(true);
    }
  };

  const handleContinue = async () => {
    if (step === 1 && frontImage) {
      setStep(2);
      setFacing('back');
    } else if (step === 2 && sideImage) {
      setIsProcessing(true);
      await AsyncStorage.setItem('faceImages', JSON.stringify({ front: frontImage, side: sideImage }));
      setTimeout(() => {
        setIsProcessing(false);
        router.push('/results-preview');
      }, 2000);
    }
  };

  if (cameraActive && permission?.granted) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}>
          <View style={{ flex: 1 }}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity onPress={() => setCameraActive(false)} style={styles.cameraBtn}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <View style={styles.stepBadge}><Text style={styles.stepText}>{step}/2</Text></View>
              <TouchableOpacity onPress={() => setFacing(facing === 'front' ? 'back' : 'front')} style={styles.cameraBtn}>
                <Ionicons name="camera-reverse" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.cameraGuide}>
              <View style={styles.cameraFrame} />
              <Text style={styles.cameraText}>{step === 1 ? 'Position your face (front view)' : 'Turn your head to the side'}</Text>
            </View>
            <View style={styles.captureArea}>
              <TouchableOpacity onPress={takePhoto} style={styles.captureBtn}>
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
        <TouchableOpacity onPress={() => step === 1 ? router.back() : setStep(1)}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
          <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Text style={styles.title}>{step === 1 ? 'Front View Selfie' : 'Side Profile'}</Text>
          <Text style={styles.subtitle}>{step === 1 ? 'Take a clear front-facing photo' : 'Now turn your head to show your side profile'}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.uploadArea}>
          {!currentImage ? (
            <TouchableOpacity onPress={pickImage} style={styles.uploadBox}>
              <View style={styles.uploadIcon}><Ionicons name="person-outline" size={48} color="#a855f7" /></View>
              <Text style={styles.uploadText}>{step === 1 ? 'Upload front photo' : 'Upload side photo'}</Text>
              <Text style={styles.uploadHint}>or use camera below</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.previewContainer}>
              <Image source={{ uri: currentImage }} style={styles.preview} />
              {isProcessing && (
                <View style={styles.processingOverlay}>
                  <ActivityIndicator size="large" color="#a855f7" />
                  <Text style={styles.processingText}>Analyzing your face...</Text>
                </View>
              )}
              <TouchableOpacity onPress={() => setCurrentImage(null)} style={styles.clearBtn}>
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        <View style={styles.actions}>
          {!currentImage && (
            <TouchableOpacity onPress={startCamera} style={styles.cameraButton}>
              <Ionicons name="camera-outline" size={22} color="white" />
              <Text style={styles.cameraButtonText}>Use Camera</Text>
            </TouchableOpacity>
          )}
          {currentImage && !isProcessing && (
            <TouchableOpacity onPress={handleContinue}>
              <LinearGradient colors={['#a855f7', '#7c3aed']} style={styles.continueBtn}>
                <Text style={styles.continueText}>{step === 1 ? 'Continue to Side Photo' : 'Analyze My Face'}</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cameraContainer: { flex: 1, backgroundColor: 'black' },
  cameraHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60 },
  cameraBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  stepBadge: { backgroundColor: 'rgba(168,85,247,0.8)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  stepText: { color: 'white', fontWeight: 'bold' },
  cameraGuide: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cameraFrame: { width: 250, height: 320, borderWidth: 3, borderColor: '#a855f7', borderRadius: 160 },
  cameraText: { color: 'white', marginTop: 24, fontSize: 16 },
  captureArea: { alignItems: 'center', paddingBottom: 48 },
  captureBtn: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: 'white', alignItems: 'center', justifyContent: 'center' },
  captureInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'white' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 },
  stepIndicator: { flexDirection: 'row', gap: 8 },
  stepDot: { width: 32, height: 4, borderRadius: 2, backgroundColor: '#35354a' },
  stepDotActive: { backgroundColor: '#a855f7' },
  content: { flex: 1, paddingHorizontal: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: '#9ca3af', fontSize: 16, textAlign: 'center', marginBottom: 32 },
  uploadArea: { flex: 1, maxHeight: 400 },
  uploadBox: { flex: 1, borderWidth: 2, borderStyle: 'dashed', borderColor: '#4b5563', borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  uploadIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(168,85,247,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  uploadText: { color: 'white', fontWeight: '600', fontSize: 18 },
  uploadHint: { color: '#6b7280', marginTop: 8 },
  previewContainer: { flex: 1, borderRadius: 24, overflow: 'hidden' },
  preview: { width: '100%', height: '100%' },
  processingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center' },
  processingText: { color: 'white', marginTop: 16, fontSize: 16 },
  clearBtn: { position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  actions: { paddingVertical: 24, gap: 12 },
  cameraButton: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  cameraButtonText: { color: 'white', fontWeight: '600', fontSize: 16 },
  continueBtn: { borderRadius: 16, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  continueText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
