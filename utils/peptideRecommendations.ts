// Peptide recommendations based on face analysis results

export interface PeptideRecommendation {
  name: string;
  purpose: string;
  dosage: string;
  frequency: string;
  weeklySchedule: string[];
  duration: string;
  benefits: string[];
  icon: string;
}

export interface PeptidePlan {
  title: string;
  description: string;
  peptides: PeptideRecommendation[];
  totalWeeklyDoses: number;
}

// Generate personalized peptide plan based on face analysis scores
export function generatePeptidePlan(results: {
  overall: number;
  skinQuality: number;
  jawline: number;
  masculinity: number;
  potential: number;
}): PeptidePlan {
  const peptides: PeptideRecommendation[] = [];

  // Skin quality improvement peptides
  if (results.skinQuality < 7) {
    peptides.push({
      name: 'GHK-Cu',
      purpose: 'Skin Regeneration & Collagen',
      dosage: '200-500mcg',
      frequency: '1x daily',
      weeklySchedule: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      duration: '8-12 weeks',
      benefits: ['Increases collagen production', 'Improves skin elasticity', 'Reduces fine lines', 'Enhances skin firmness'],
      icon: 'sparkles',
    });
  }

  // Jawline & facial structure peptides
  if (results.jawline < 7 || results.masculinity < 7) {
    peptides.push({
      name: 'CJC-1295 + Ipamorelin',
      purpose: 'Growth Hormone Release',
      dosage: '100mcg each',
      frequency: '2x daily',
      weeklySchedule: ['Mon', 'Wed', 'Fri'],
      duration: '12-16 weeks',
      benefits: ['Promotes lean muscle', 'Enhances facial bone density', 'Improves body composition', 'Better sleep quality'],
      icon: 'fitness',
    });
  }

  // Anti-aging & overall improvement
  if (results.overall < 8) {
    peptides.push({
      name: 'BPC-157',
      purpose: 'Healing & Recovery',
      dosage: '250-500mcg',
      frequency: '1x daily',
      weeklySchedule: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      duration: '4-8 weeks',
      benefits: ['Accelerates healing', 'Reduces inflammation', 'Improves gut health', 'Tissue repair'],
      icon: 'medkit',
    });
  }

  // Potential maximization
  if (results.potential > results.overall) {
    peptides.push({
      name: 'Epithalon',
      purpose: 'Anti-Aging & Telomere Support',
      dosage: '5-10mg',
      frequency: 'Cycle: 10 days on',
      weeklySchedule: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
      duration: '10-day cycles, 3x per year',
      benefits: ['Telomere elongation', 'DNA protection', 'Enhanced longevity', 'Improved skin quality'],
      icon: 'hourglass',
    });
  }

  // Always recommend for optimization
  peptides.push({
    name: 'TB-500',
    purpose: 'Tissue Regeneration',
    dosage: '2-2.5mg',
    frequency: '2x weekly',
    weeklySchedule: ['Mon', 'Thu'],
    duration: '4-6 weeks loading, then maintenance',
    benefits: ['Promotes healing', 'Reduces inflammation', 'Improves flexibility', 'Hair growth support'],
    icon: 'leaf',
  });

  // Collagen booster for skin
  peptides.push({
    name: 'Collagen Peptides',
    purpose: 'Skin & Joint Health',
    dosage: '10-15g',
    frequency: '1x daily (oral)',
    weeklySchedule: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    duration: 'Ongoing',
    benefits: ['Improved skin hydration', 'Reduced wrinkles', 'Stronger hair/nails', 'Joint support'],
    icon: 'water',
  });

  const totalWeeklyDoses = peptides.reduce((sum, p) => {
    return sum + p.weeklySchedule.length;
  }, 0);

  return {
    title: 'Your Personalized Peptide Protocol',
    description: `Based on your analysis, we've created a customized peptide stack to help you reach your ${results.potential.toFixed(1)} potential score.`,
    peptides,
    totalWeeklyDoses,
  };
}

// Body-specific peptide recommendations
export function generateBodyPeptidePlan(results: {
  bodyFat?: number;
  muscleMass?: number;
  overall: number;
}): PeptidePlan {
  const peptides: PeptideRecommendation[] = [];

  // Fat loss peptides
  peptides.push({
    name: 'Tesamorelin',
    purpose: 'Targeted Fat Reduction',
    dosage: '2mg',
    frequency: '1x daily',
    weeklySchedule: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    duration: '12-24 weeks',
    benefits: ['Reduces visceral fat', 'Improves body composition', 'Enhances metabolism', 'FDA-approved'],
    icon: 'flame',
  });

  // Muscle building
  peptides.push({
    name: 'GHRP-6',
    purpose: 'Muscle Growth & Appetite',
    dosage: '100-300mcg',
    frequency: '2-3x daily',
    weeklySchedule: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    duration: '8-12 weeks',
    benefits: ['Stimulates GH release', 'Increases appetite', 'Promotes muscle growth', 'Improves recovery'],
    icon: 'barbell',
  });

  // Recovery
  peptides.push({
    name: 'Follistatin',
    purpose: 'Muscle Mass Enhancement',
    dosage: '100mcg',
    frequency: '1x daily',
    weeklySchedule: ['Mon', 'Wed', 'Fri'],
    duration: '4-8 weeks',
    benefits: ['Inhibits myostatin', 'Promotes muscle growth', 'Enhances strength', 'Body recomposition'],
    icon: 'body',
  });

  const totalWeeklyDoses = peptides.reduce((sum, p) => sum + p.weeklySchedule.length, 0);

  return {
    title: 'Body Optimization Protocol',
    description: 'A targeted peptide stack for body composition improvement.',
    peptides,
    totalWeeklyDoses,
  };
}
