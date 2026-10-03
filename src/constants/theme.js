import { STATUS } from './settings';

// All colors in one place so the design stays consistent.
export const COLORS = {
  primary: '#2563EB',
  background: '#F3F4F6',
  card: '#FFFFFF',
  text: '#111827',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  safe: '#16A34A',
  atRisk: '#D97706',
  short: '#DC2626',
  neutral: '#9CA3AF',
};

// Each status gets its own color (used by badges and warnings).
export const STATUS_COLORS = {
  [STATUS.SAFE]: COLORS.safe,
  [STATUS.AT_RISK]: COLORS.atRisk,
  [STATUS.SHORT]: COLORS.short,
  [STATUS.NO_CLASSES]: COLORS.neutral,
};

export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24 };

export const FONT_SIZES = { sm: 12, md: 14, lg: 18, xl: 24 };

export const RADIUS = 12;