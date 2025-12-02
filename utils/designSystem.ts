/**
 * Premium Design System
 * High-end visual identity for a $100k-budget social app
 */

// Color Palette - Sophisticated dark theme with vibrant accents
export const colors = {
  // Backgrounds - Deep, rich tones
  background: {
    primary: '#070B14',      // Deep space black
    secondary: '#0D1321',    // Rich charcoal
    tertiary: '#141B2D',     // Elevated surface
    card: '#1A2235',         // Card background
    elevated: '#1F2942',     // Elevated elements
  },
  
  // Accent Colors - Electric blue gradient system
  accent: {
    primary: '#00D4FF',      // Electric cyan
    secondary: '#0EA5E9',    // Sky blue
    tertiary: '#38BDF8',     // Light sky
    gradient: ['#00D4FF', '#0EA5E9', '#6366F1'], // Premium gradient
    glow: 'rgba(0, 212, 255, 0.3)', // Glow effect
  },
  
  // Text - High contrast for readability
  text: {
    primary: '#FFFFFF',
    secondary: '#94A3B8',    // Muted gray
    tertiary: '#64748B',     // Subtle gray
    accent: '#00D4FF',
  },
  
  // Status Colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  // Overlay & Effects
  overlay: {
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.08)',
    heavy: 'rgba(255, 255, 255, 0.12)',
    dark: 'rgba(0, 0, 0, 0.5)',
    blur: 'rgba(13, 19, 33, 0.8)',
  },
  
  // Border Colors
  border: {
    subtle: 'rgba(255, 255, 255, 0.06)',
    default: 'rgba(255, 255, 255, 0.1)',
    accent: 'rgba(0, 212, 255, 0.3)',
  },
};

// Typography Scale - Clean, modern hierarchy
export const typography = {
  // Font sizes following 4px grid
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Font weights
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  
  // Letter spacing
  tracking: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

// Spacing System - 4px base grid
export const spacing = {
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
};

// Border Radius - Smooth, modern curves
export const radius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// Shadows - Subtle, luxurious depth
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  glow: {
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 0,
  },
  glowIntense: {
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 0,
  },
};

// Animation Timing - Smooth, natural motion
export const animation = {
  // Durations (ms)
  duration: {
    instant: 100,
    fast: 150,
    normal: 250,
    slow: 400,
    slower: 600,
  },
  
  // Spring configs for react-native-reanimated
  spring: {
    gentle: { damping: 20, stiffness: 100 },
    bouncy: { damping: 12, stiffness: 150 },
    snappy: { damping: 15, stiffness: 400 },
    stiff: { damping: 20, stiffness: 300 },
  },
  
  // Easing curves
  easing: {
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

// Component Styles - Reusable premium components
export const components = {
  button: {
    primary: {
      height: 56,
      borderRadius: radius.xl,
      paddingHorizontal: spacing[8],
    },
    secondary: {
      height: 48,
      borderRadius: radius.lg,
      paddingHorizontal: spacing[6],
    },
  },
  
  card: {
    borderRadius: radius['2xl'],
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.background.card,
  },
  
  input: {
    height: 52,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[5],
    backgroundColor: colors.overlay.light,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
};

// Gradients
export const gradients = {
  primary: ['#00D4FF', '#0EA5E9'],
  primaryReverse: ['#0EA5E9', '#00D4FF'],
  accent: ['#00D4FF', '#0EA5E9', '#6366F1'],
  dark: ['#070B14', '#0D1321', '#141B2D'],
  card: ['#1A2235', '#141B2D'],
  glow: ['rgba(0, 212, 255, 0.2)', 'rgba(0, 212, 255, 0)'],
  success: ['#10B981', '#059669'],
  premium: ['#F59E0B', '#D97706'],
};

export default {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  animation,
  components,
  gradients,
};
