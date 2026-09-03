// 简历数据类型（JSON Resume 子集）
// 多语言模型：整份按语言分版本，ResumeDoc = { zh: Resume; en: Resume }

export type Lang = 'zh' | 'en';
export type TemplateId = 'basic' | 'modern' | 'minimal' | 'tabular' | 'pure';

export interface Location {
  city: string;
  region: string;
}

export interface Profile {
  network: string;
  url: string;
}

export interface Basics {
  name: string;
  label: string;
  gender: string;
  birthDate: string;
  email: string;
  phone: string;
  website: string;
  summary: string;
  highlights?: string[];
  location?: Location;
  profiles?: Profile[];
}

export interface Work {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
  stack?: string[];
}

export interface Education {
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score: string;
}

export interface Skill {
  name: string;
  level: string;
  keywords: string[];
}

export interface Project {
  name: string;
  description: string;
  url: string;
  startDate: string;
  endDate: string;
  highlights: string[];
  roles?: string[];
}

export interface Award {
  title: string;
  date: string;
  awarder: string;
  summary: string;
}

export interface Certificate {
  name: string;
  issuer: string;
  date: string;
  url: string;
  summary: string;
}

export interface LanguageItem {
  language: string;
  fluency: string;
}

export interface Resume {
  basics: Basics;
  work: Work[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
  awards: Award[];
  languages: LanguageItem[];
  interests: string[];
}

// 多语言文档：中/英各一份完整简历
export interface ResumeDoc {
  zh: Resume;
  en: Resume;
}

// store 状态快照
export interface AppState {
  doc: ResumeDoc;
  lang: Lang;
  template: TemplateId;
  colors: Record<TemplateId, string>;
}
