// 预览配置：控制 work/project 技术栈等展示项，持久化到 localStorage
const KEY = 'resume-ge:cfg';

export interface AppConfig {
  showWorkStack: boolean;
  showProjectStack: boolean;
}

const DEFAULT: AppConfig = {
  showWorkStack: true,
  showProjectStack: true
};

type Listener = () => void;
const listeners = new Set<Listener>();

function load(): AppConfig {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    const p = JSON.parse(raw);
    return {
      showWorkStack: p.showWorkStack !== false,
      showProjectStack: p.showProjectStack !== false
    };
  } catch {
    return { ...DEFAULT };
  }
}

let cfg: AppConfig = load();

export function getConfig(): AppConfig {
  return cfg;
}

export function setConfig(patch: Partial<AppConfig>): void {
  cfg = { ...cfg, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(cfg));
  } catch {
    /* 隐私模式 / 配额满：静默忽略 */
  }
  listeners.forEach((fn) => fn());
}

export function subscribeConfig(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
