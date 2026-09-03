import { sampleDoc } from './sample-resume';
import type { Lang, Resume, ResumeDoc, TemplateId } from './types';

// localStorage 读写层：持久化 doc / lang / template
// 键名加项目前缀，避免与其他应用冲突
const KEYS = {
  doc: 'resume-ge:doc',
  lang: 'resume-ge:lang',
  template: 'resume-ge:template',
  colors: 'resume-ge:colors'
} as const;

const VALID_LANGS: Lang[] = ['zh', 'en'];
const VALID_TEMPLATES: TemplateId[] = ['basic', 'modern', 'minimal', 'tabular', 'pure'];

// 规范化：补全老数据缺失的字段（如新增的 certificates），缺失时回退到示例
function normalizeResume(r: Partial<Resume> | undefined, lang: Lang): Resume {
  const sample = sampleDoc[lang];
  return {
    basics: r?.basics ?? sample.basics,
    work: r?.work ?? sample.work,
    education: r?.education ?? sample.education,
    skills: r?.skills ?? sample.skills,
    projects: r?.projects ?? sample.projects,
    certificates: r?.certificates ?? sample.certificates,
    awards: r?.awards ?? sample.awards,
    languages: r?.languages ?? sample.languages,
    interests: r?.interests ?? sample.interests
  };
}

export function loadDoc(): ResumeDoc | null {
  try {
    const raw = localStorage.getItem(KEYS.doc);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.zh && parsed.en) {
      return {
        zh: normalizeResume(parsed.zh, 'zh'),
        en: normalizeResume(parsed.en, 'en')
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveDoc(doc: ResumeDoc): void {
  try {
    localStorage.setItem(KEYS.doc, JSON.stringify(doc));
  } catch {
    // QuotaExceededError 或隐私模式：静默忽略，不影响编辑
  }
}

export function loadLang(): Lang {
  const v = localStorage.getItem(KEYS.lang);
  return v === 'en' || v === 'zh' ? v : 'zh';
}

export function saveLang(lang: Lang): void {
  try {
    localStorage.setItem(KEYS.lang, lang);
  } catch {
    /* noop */
  }
}

export function loadTemplate(): TemplateId {
  const v = localStorage.getItem(KEYS.template);
  return (VALID_TEMPLATES as string[]).includes(v ?? '') ? (v as TemplateId) : 'basic';
}

export function saveTemplate(t: TemplateId): void {
  try {
    localStorage.setItem(KEYS.template, t);
  } catch {
    /* noop */
  }
}

export function loadColors(): Record<TemplateId, string> | null {
  try {
    const raw = localStorage.getItem(KEYS.colors);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return {
        basic: parsed.basic,
        modern: parsed.modern,
        minimal: parsed.minimal,
        tabular: parsed.tabular,
        pure: parsed.pure
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveColors(colors: Record<TemplateId, string>): void {
  try {
    localStorage.setItem(KEYS.colors, JSON.stringify(colors));
  } catch {
    /* noop */
  }
}

export { VALID_LANGS, VALID_TEMPLATES };
