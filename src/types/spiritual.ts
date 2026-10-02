export interface NatalData {
  fullName: string;
  birthDate: string; // YYYY-MM-DD or DD/MM/YYYY
  birthTime?: string; // HH:mm
  city: string;
  timezone?: string; // e.g. America/Sao_Paulo
}

export type IntentCategory =
  | 'amor'
  | 'relacionamento'
  | 'reconciliacao'
  | 'trabalho'
  | 'emprego'
  | 'carreira'
  | 'sociedade'
  | 'negocios'
  | 'dinheiro'
  | 'familia'
  | 'amizade'
  | 'saude_emocional'
  | 'protecao'
  | 'espiritualidade'
  | 'decisao'
  | 'outros';

export type ParticipantRole =
  | 'consulente'
  | 'parceiro_amoroso'
  | 'ex'
  | 'socio'
  | 'amigo'
  | 'familiar'
  | 'chefe'
  | 'funcionario'
  | 'outro';

export interface Participant {
  name: string;
  birthDate?: string;
  role: ParticipantRole;
  relationshipContext?: string;
}

export interface IntentAnalysis {
  primaryCategory: IntentCategory;
  isRomantic: boolean;
  isBusinessOrCareer: boolean;
  participants: Participant[];
  resolvedTimeframe?: {
    rawTerm?: string;
    resolvedDate?: string;
    description: string;
  };
  summary: string;
}

export interface TarotCard {
  id: string;
  number: number;
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'copas' | 'espadas' | 'ouros' | 'paus';
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning?: string;
  spiritualAdvice: string;
}

export interface TarotDrawPosition {
  position: number;
  label: string; // 'Passado / Raiz', 'Presente / Energia Atual', 'Tendência / Caminho'
  card: TarotCard;
  isReversed: boolean;
  specificInterpretation?: string;
}

export interface BuziosResult {
  openCount: number;
  closedCount: number;
  oduName: string;
  oduEnergy: string;
  oduAdvice: string;
  oduShadow: string;
  shellsOpenIndices: number[];
  shellsClosedIndices: number[];
}

export interface NumerologyResult {
  lifePathNumber: number;
  expressionNumber: number;
  soulUrgeNumber: number;
  karmicLessonNumber?: number;
  summary: string;
  strengths: string[];
  challenges: string[];
}

export interface OracleRawResult {
  tarotSpread?: TarotDrawPosition[];
  buzios?: BuziosResult;
  numerology?: NumerologyResult;
  oduCalculated?: {
    name: string;
    number: number;
    description: string;
  };
  cabala?: any;
  astrology?: any;
  customDetails?: Record<string, any>;
}

export interface OracleReadingRecord {
  id: string;
  readingId: string;
  uid: string;
  oracleType: 'tarot' | 'buzios' | 'numerology' | 'odu' | 'cabala' | 'astrology' | 'premium_complete';
  spreadType?: string;
  question: string;
  intent: IntentAnalysis;
  natalSnapshot: NatalData;
  rawResult: OracleRawResult;
  interpretationHtml: string;
  practicalAdvice: string;
  spiritualWarning?: string;
  modelUsed: string;
  fallbackLevel: number;
  creditCost: number;
  createdAt: string;
  timezone: string;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  birthDate: string;
  birthTime?: string;
  city: string;
  timezone?: string;
  credits: number;
  isBlocked: boolean;
  isVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  mfaEnabled: boolean;
  antiFraudScore: number;
  deviceFingerprint: string;
  promotionalCreditsBlocked?: boolean;
  fraudReasons?: string[];
  role?: 'user' | 'admin';
  lastPlanId?: string;
  level?: number;
  xp?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreditLedgerEntry {
  id: string;
  uid: string;
  type: 'purchase' | 'reading' | 'chat' | 'refund' | 'admin_adjustment' | 'promotion';
  amount: number; // e.g. -3 or +30
  previousBalance: number;
  newBalance: number;
  referenceId?: string; // readingId, paymentId, or chatId
  idempotencyKey?: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface PaymentOrder {
  orderId: string;
  uid: string;
  userEmail: string;
  planId: string;
  planName: string;
  expectedAmount: number;
  currency: 'BRL';
  expectedCredits: number;
  status: 'pending' | 'approved' | 'rejected' | 'credited' | 'failed';
  providerPreferenceId?: string;
  providerPaymentId?: string;
  initPoint?: string;
  sandboxInitPoint?: string;
  creditedAt?: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingHistory {
  id: string;
  userId: string;
  type: string;
  title: string;
  date: string;
  content: any;
  creditsUsed: number;
  readingRecord?: OracleReadingRecord;
}

export interface DiaryEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: 'sonho' | 'sinal' | 'intuicao' | 'acontecimento';
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PomboGira {
  id: string;
  name: string;
  realm: string;
  element: string;
  offering: string;
  description: string;
  advice: string;
}

export interface FraudLog {
  id: string;
  timestamp: string;
  userId?: string;
  email?: string;
  type:
    | 'vpn_detected'
    | 'multiple_accounts'
    | 'high_rate_limit'
    | 'fingerprint_mismatch'
    | 'blocked_device'
    | 'suspicious_activity'
    | 'login_success'
    | 'login_not_found'
    | 'blocked_login_attempt'
    | 'blocked_device_access'
    | 'admin_action'
    | 'auth_failure'
    | 'rate_limit';
  description: string;
  ip: string;
  vpn: boolean;
  riskScore: number;
  deviceFingerprint: string;
}

export interface CreditPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  badge?: string;
  color: string;
}

export const ORACLE_QUESTION_COST = 5;
export const ORACLE_FOLLOWUP_COST = 5;
export const POMBO_GIRA_ADVICE_COST = 5;
export const READING_CONSULTATION_COST = 5;
export const LOVE_COMPATIBILITY_COST = 5;
export const FREE_GREETING_SUPPORT_COST = 0;

export interface PermanentSpiritualProfile {
  uid: string;
  natalProfileVersion: number;
  natalSignature: string; // Hash of fullName + birthDate + birthTime + city
  numerology: {
    lifePath: number;
    expression: number;
    soulUrge: number;
    karmicLessons: number[];
    personalYear: number;
    summary: string;
  };
  cabala: {
    sephirahNumber: number;
    sephirahName: string;
    divineAttribute: string;
    rulingArchangel: string;
    guardianAngelName: string;
    guardianAngelChoir: string;
    virtue: string;
    spiritualGuidance: string;
  };
  astrology: {
    sunSign: string;
    element: string;
    rulingPlanet: string;
    lunarPhase: string;
    planetaryHour: string;
    astrologicalGuidance: string;
  };
  karmicPatterns: {
    karmicLessons: string[];
    soulMission: string;
    relationshipDynamic: string;
  };
  spiritualCycles: {
    personalYear: number;
    cycleTheme: string;
    spiritualPhase: string;
  };
  archetypes: {
    primaryArchetype: string;
    shadowArchetype: string;
    pomboGiraAffinity: string;
  };
  recurrentLessons: string[];
  reincarnationThemes: string[];
  personalityPatterns: string[];
  relationshipPatterns: string[];
  spiritualStrengths: string[];
  spiritualChallenges: string[];
  updatedAt: string;
  methodVersions: Record<string, string>;
}

export interface LivingSpiritualHistory {
  uid: string;
  recurringThemes: string[];
  importantRelations: Array<{
    name: string;
    relationship: string;
    notes?: string;
    updatedAt: string;
  }>;
  reportedEvents: Array<{
    event: string;
    date: string;
  }>;
  previousReadings: Array<{
    id: string;
    date: string;
    oracleType: string;
    summary: string;
  }>;
  lifeShifts: string[];
  perceivedPatterns: string[];
  updatedAt: string;
}
