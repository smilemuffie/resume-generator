import type { AppState, Lang, Resume, ResumeDoc, TemplateId } from './types';
import { DEFAULT_COLORS } from './theme';
import { saveColors, saveDoc, saveLang, saveTemplate } from './storage';

// 极简发布订阅 + 内存状态
// doc: 中/英各一份；lang: 当前编辑语言；template: 当前模板；colors: 各模板绑定主题色
type Listener = (state: AppState) => void;

let state: AppState = {
  doc: { zh: emptyResume(), en: emptyResume() },
  lang: 'zh',
  template: 'basic',
  colors: { ...DEFAULT_COLORS }
};

const listeners = new Set<Listener>();

export function initStore(initial: AppState): void {
  // colors 与默认值合并，保证三模板都有值
  state = { ...initial, colors: { ...DEFAULT_COLORS, ...initial.colors } };
}

export function getState(): AppState {
  return state;
}

export function getResume(): Resume {
  return state.doc[state.lang];
}

export function getDoc(): ResumeDoc {
  return state.doc;
}

// 更新某语言的简历（编辑器每次有效变更调用）
export function setResumeAt(lang: Lang, resume: Resume): void {
  if (state.doc[lang] === resume) return;
  state = {
    ...state,
    doc: { ...state.doc, [lang]: resume }
  };
  saveDoc(state.doc);
  notify();
}

export function setLang(lang: Lang): void {
  if (state.lang === lang) return;
  state = { ...state, lang };
  saveLang(lang);
  notify();
}

export function setTemplate(t: TemplateId): void {
  if (state.template === t) return;
  state = { ...state, template: t };
  saveTemplate(t);
  notify();
}

// 设置当前模板绑定的主题色（不影响其他模板）
export function setThemeColor(accent: string): void {
  state = { ...state, colors: { ...state.colors, [state.template]: accent } };
  saveColors(state.colors);
  notify();
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify(): void {
  for (const fn of listeners) fn(state);
}

// 空简历占位（类型上满足 Resume，运行时由调用方替换为 sampleDoc）
function emptyResume(): Resume {
  return {
    basics: {
      name: '',
      label: '',
      email: '',
      phone: '',
      website: '',
      summary: ''
    },
    work: [],
    education: [],
    skills: [],
    projects: [],
    certificates: [],
    awards: [],
    languages: [],
    interests: []
  };
}
