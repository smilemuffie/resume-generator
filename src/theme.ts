import type { TemplateId } from './types';

export interface ThemeColor {
  name: string;
  accent: string;
  soft: string;
}

// 主题色调色盘：accent 主色 + soft 同色系浅底（用于 --accent-soft / --bg-soft）
export const THEME_COLORS: ThemeColor[] = [
  { name: '墨蓝', accent: '#2c5282', soft: '#eaf1fb' },
  { name: '天蓝', accent: '#3b82f6', soft: '#dbeafe' },
  { name: '深海青', accent: '#0f766e', soft: '#e6f3f1' },
  { name: '靛紫', accent: '#7c3aed', soft: '#ede9fe' },
  { name: '玫红', accent: '#db2777', soft: '#fce7f3' },
  { name: '砖红', accent: '#c2410c', soft: '#ffedd5' },
  { name: '琥珀', accent: '#b45309', soft: '#fef3c7' },
  { name: '森绿', accent: '#15803d', soft: '#dcfce7' },
  { name: '炭黑', accent: '#1f2937', soft: '#f1f3f5' }
];

// 各模板默认配色（与 CSS 初始值一致）
export const DEFAULT_COLORS: Record<TemplateId, string> = {
  basic: '#2c5282',
  modern: '#3b82f6',
  minimal: '#0f766e',
  tabular: '#1e40af',
  pure: '#1f2937'
};

// 由 accent 查找配套的 soft；未命中回退第一项
export function getThemePair(accent: string): ThemeColor {
  return THEME_COLORS.find((c) => c.accent === accent) ?? THEME_COLORS[0];
}
