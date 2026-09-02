import type { Lang } from '../../types';

// HTML 转义，防注入
export const esc = (s: unknown = ''): string =>
  String(s ?? '').replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string)
  );

// 日期区间：'2022-01 – 至今'
export function dateRange(start = '', end = ''): string {
  const s = (start || '').trim();
  const e = (end || '').trim();
  if (s && e) return `${s} – ${e}`;
  return s || e || '';
}

// 由出生年月计算周岁；支持 YYYY-MM / YYYY-MM-DD / YYYY/MM 等
export function calcAge(birthDate: string): number | null {
  const s = (birthDate || '').trim();
  if (!s) return null;
  const parts = s.split(/[-/.]/).map((p) => parseInt(p, 10)).filter((n) => !isNaN(n));
  if (parts.length < 2) return null;
  const year = parts[0];
  const month = parts[1];
  const day = parts[2] || 1;
  if (year < 1900 || year > 2100) return null;
  const now = new Date();
  let age = now.getFullYear() - year;
  if (
    now.getMonth() + 1 < month ||
    (now.getMonth() + 1 === month && now.getDate() < day)
  ) {
    age--;
  }
  return age >= 0 ? age : null;
}

// 年龄文案：zh -> "35 岁"，en -> "35 yrs"
export function ageLabel(birthDate: string, lang: Lang): string {
  const age = calcAge(birthDate);
  if (age === null) return '';
  return lang === 'zh' ? `${age} 岁` : `${age} yrs`;
}

// 列表项（使用默认 <li>，符号由 CSS ::before 绘制）
// 支持 HTML：内容原样输出，可写 <b>/<a>/<br> 等标签，也可纯文本
export function listItems(items: string[] = []): string {
  return (items || [])
    .filter((i) => i && String(i).trim())
    .map((i) => `<li>${i}</li>`)
    .join('');
}

export interface Labels {
  work: string;
  projects: string;
  education: string;
  skills: string;
  awards: string;
  certificates: string;
  languages: string;
  interests: string;
  summary: string;
}

// 区块标题随当前语言本地化（模板 chrome 不在 JSON 内）
export const LABELS: Record<Lang, Labels> = {
  zh: {
    work: '工作经历',
    projects: '项目经历',
    education: '教育经历',
    skills: '技能',
    awards: '荣誉奖项',
    certificates: '证书',
    languages: '语言能力',
    interests: '兴趣',
    summary: '个人简介'
  },
  en: {
    work: 'Experience',
    projects: 'Projects',
    education: 'Education',
    skills: 'Skills',
    awards: 'Awards',
    certificates: 'Certificates',
    languages: 'Languages',
    interests: 'Interests',
    summary: 'Profile'
  }
};

// ===== 内联 SVG 图标（14×14，stroke=currentColor，零依赖） =====
export type IconName =
  | 'mail'
  | 'phone'
  | 'globe'
  | 'pin'
  | 'link'
  | 'briefcase'
  | 'folder'
  | 'cap'
  | 'medal'
  | 'certificate'
  | 'translate'
  | 'heart'
  | 'sparkles'
  | 'user'
  | 'clock';

const ICON_PATHS: Record<IconName, string> = {
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  phone:
    '<path d="M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/>',
  pin: '<path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  link: '<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',
  briefcase:
    '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  cap: '<path d="M2 9l10-4 10 4-10 4z"/><path d="M6 11v5a6 6 0 0 0 12 0v-5"/><path d="M22 9v6"/>',
  medal: '<circle cx="12" cy="9" r="5"/><path d="M9 13l-2 8 5-3 5 3-2-8"/>',
  certificate:
    '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h6"/><path d="M8 12h4"/><circle cx="14" cy="16" r="2.5"/><path d="M12.5 18.5L14 22l1.5-3.5"/>',
  translate:
    '<path d="M4 5h7"/><path d="M7 3v2c0 4-2 6-5 7"/><path d="M4 12c2-1 4-3 4-5"/><path d="M14 19h7"/><path d="M17 21l-4-9h3l4 9z"/>',
  heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z"/>',
  sparkles:
    '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/><path d="M19 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
};

export function icon(name: IconName): string {
  return `<svg class="icn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name]}</svg>`;
}

// chip 徽章：accent=强调色描边淡底，plain=灰描边
export function chip(text: string, variant: 'accent' | 'plain' = 'plain'): string {
  return `<span class="chip chip--${variant}">${esc(text)}</span>`;
}
