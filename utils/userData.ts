import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for persistent storage
const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  FACE_RESULTS: 'faceResults',
  FACE_IMAGES: 'faceImages',
  BODY_RESULTS: 'bodyResults',
  BODY_IMAGES: 'bodyImages',
  PREMIUM_STATUS: 'premium_status',
  SCAN_HISTORY: 'scan_history',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  USER_GOALS: 'user_goals',
  USER_GENDER: 'user_gender',
};

export interface UserProfile {
  id?: string;
  email?: string;
  name?: string;
  gender?: string;
  goals?: string[];
  createdAt?: string;
  lastScanAt?: string;
}

export interface PremiumStatus {
  isPremium: boolean;
  purchasedAt?: string;
  expiresAt?: string;
  plan?: 'weekly' | 'monthly' | 'yearly' | 'lifetime';
}

export interface ScanHistoryEntry {
  id: string;
  type: 'face' | 'body';
  date: string;
  results: any;
}

// User Profile Functions
export async function saveUserProfile(profile: Partial<UserProfile>): Promise<void> {
  try {
    const existing = await getUserProfile();
    const updated = { ...existing, ...profile };
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
}

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

// Premium Status Functions
export async function setPremiumStatus(status: PremiumStatus): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, JSON.stringify(status));
  } catch (error) {
    console.error('Error saving premium status:', error);
  }
}

export async function getPremiumStatus(): Promise<PremiumStatus> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error getting premium status:', error);
  }
  return { isPremium: false };
}

export async function activatePremium(plan: PremiumStatus['plan'] = 'lifetime'): Promise<void> {
  const now = new Date().toISOString();
  let expiresAt: string | undefined;
  
  if (plan === 'weekly') {
    expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  } else if (plan === 'monthly') {
    expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  } else if (plan === 'yearly') {
    expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  }
  // lifetime has no expiry
  
  await setPremiumStatus({
    isPremium: true,
    purchasedAt: now,
    expiresAt,
    plan,
  });
}

// Face Results Functions
export async function saveFaceResults(results: any): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FACE_RESULTS, JSON.stringify(results));
    
    // Also save to scan history
    await addToScanHistory({
      id: Date.now().toString(),
      type: 'face',
      date: new Date().toISOString(),
      results,
    });
    
    // Update last scan time
    await saveUserProfile({ lastScanAt: new Date().toISOString() });
  } catch (error) {
    console.error('Error saving face results:', error);
  }
}

export async function getFaceResults(): Promise<any | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.FACE_RESULTS);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error getting face results:', error);
    return null;
  }
}

export async function hasFaceResults(): Promise<boolean> {
  const results = await getFaceResults();
  return results !== null;
}

// Body Results Functions
export async function saveBodyResults(results: any): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BODY_RESULTS, JSON.stringify(results));
    
    await addToScanHistory({
      id: Date.now().toString(),
      type: 'body',
      date: new Date().toISOString(),
      results,
    });
  } catch (error) {
    console.error('Error saving body results:', error);
  }
}

export async function getBodyResults(): Promise<any | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.BODY_RESULTS);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error getting body results:', error);
    return null;
  }
}

// Scan History Functions
export async function addToScanHistory(entry: ScanHistoryEntry): Promise<void> {
  try {
    const history = await getScanHistory();
    history.push(entry);
    // Keep only last 50 scans
    const trimmed = history.slice(-50);
    await AsyncStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error adding to scan history:', error);
  }
}

export async function getScanHistory(): Promise<ScanHistoryEntry[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting scan history:', error);
    return [];
  }
}

// Check if user has completed onboarding and has scan data
export async function hasCompletedSetup(): Promise<boolean> {
  try {
    const [faceResults, onboarding] = await Promise.all([
      getFaceResults(),
      AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE),
    ]);
    return faceResults !== null && onboarding === 'true';
  } catch (error) {
    return false;
  }
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
}

// Clear all user data (for logout)
export async function clearAllUserData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
}
