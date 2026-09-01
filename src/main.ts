import './styles/app.css';
import './styles/templates.css';
import './styles/print.css';

import { sampleDoc } from './sample-resume';
import { loadColors, loadDoc, loadLang } from './storage';
import {
  getState,
  initStore,
  setLang,
  setThemeColor,
  subscribe
} from './store';
import { THEME_COLORS } from './theme';
import { clearEditor, getEditorText, initEditor } from './editor/json-editor';
import { initRenderer } from './render/renderer';
import { initExport } from './export/print';
import type { Lang, TemplateId } from './types';

function bootstrap(): void {
  // 1. 持久化回填 / 默认 sample
  const doc = loadDoc() ?? sampleDoc;
  initStore({
    doc,
    lang: loadLang(),
    template: 'minimal',
    colors: loadColors() ?? ({} as Record<TemplateId, string>)
  });

  // 2. 抓 DOM
  const cmHost = document.querySelector<HTMLElement>('.cm-host');
  const previewEl = document.querySelector<HTMLElement>('.preview-scroll');
  const exportBtn = document.querySelector<HTMLButtonElement>('.btn-export');
  const formatBtn = document.querySelector<HTMLButtonElement>('.btn-format');
  const paletteEl = document.querySelector<HTMLElement>('.theme-palette');
  const langBtns = document.querySelectorAll<HTMLButtonElement>('.lang-btn');
  if (!cmHost || !previewEl || !exportBtn || !formatBtn || !paletteEl || !langBtns.length) {
    console.error('初始化失败：缺少必要的 DOM 节点');
    return;
  }

  // 3. 装配编辑器 / 渲染器 / 导出
  initEditor(cmHost);
  initRenderer(previewEl);
  initExport(exportBtn);

  // 复制编辑器内容到剪贴板
  const copyBtn = document.querySelector<HTMLButtonElement>('#copy-btn');
  const toastEl = document.querySelector<HTMLElement>('#toast');
  let toastTimer: number | undefined;
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const text = getEditorText();
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.classList.add('is-copied');
        if (toastEl) {
          toastEl.textContent = '复制成功';
          toastEl.classList.add('is-visible');
          if (toastTimer) window.clearTimeout(toastTimer);
          toastTimer = window.setTimeout(() => toastEl.classList.remove('is-visible'), 1600);
        }
        setTimeout(() => {
          copyBtn.classList.remove('is-copied');
          copyBtn.title = '复制 JSON';
        }, 1500);
      } catch {
        if (toastEl) {
          toastEl.textContent = '复制失败';
          toastEl.classList.add('is-visible');
          if (toastTimer) window.clearTimeout(toastTimer);
          toastTimer = window.setTimeout(() => toastEl.classList.remove('is-visible'), 1600);
        }
      }
    });
  }

  // 清空编辑器（二次确认弹窗）
  const clearBtn = document.querySelector<HTMLButtonElement>('#clear-btn');
  const clearModal = document.querySelector<HTMLElement>('#clear-modal');
  const clearConfirm = document.querySelector<HTMLButtonElement>('#clear-confirm');
  const clearCancel = document.querySelector<HTMLButtonElement>('#clear-cancel');
  const hideClearModal = () => clearModal?.classList.remove('is-visible');
  if (clearBtn && clearModal) {
    clearBtn.addEventListener('click', () => clearModal.classList.add('is-visible'));
    clearCancel?.addEventListener('click', hideClearModal);
    clearModal.addEventListener('click', (e) => {
      if (e.target === clearModal) hideClearModal();
    });
    clearConfirm?.addEventListener('click', () => {
      clearEditor();
      hideClearModal();
      if (toastEl) {
        toastEl.textContent = '已清空';
        toastEl.classList.add('is-visible');
        if (toastTimer) window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toastEl.classList.remove('is-visible'), 1600);
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && clearModal.classList.contains('is-visible')) hideClearModal();
    });
  }

  // 4. 下载 JSON 模版（固定使用内置完整模版，含所有字段，仅中文）
  formatBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(sampleDoc.zh, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // 5. 主题色调色盘（颜色绑定到 minimal 模板，点击即换色并持久化）
  paletteEl.innerHTML = THEME_COLORS.map(
    (c) =>
      `<button type="button" class="theme-swatch" data-accent="${c.accent}" title="${c.name}" style="background:${c.accent}"></button>`
  ).join('');
  const syncPalette = (): void => {
    const active = getState().colors[getState().template];
    paletteEl.querySelectorAll<HTMLButtonElement>('.theme-swatch').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.accent === active);
    });
  };
  syncPalette();
  subscribe(syncPalette);
  paletteEl.querySelectorAll<HTMLButtonElement>('.theme-swatch').forEach((b) => {
    b.addEventListener('click', () => {
      const accent = b.dataset.accent;
      if (accent) setThemeColor(accent);
    });
  });

  // 6. 语言切换
  const syncLangUI = (): void => {
    const cur = getState().lang;
    langBtns.forEach((b) => b.classList.toggle('is-active', b.dataset.lang === cur));
  };
  syncLangUI();
  subscribe(syncLangUI);
  langBtns.forEach((b) => {
    b.addEventListener('click', () => {
      const l = b.dataset.lang as Lang | undefined;
      if (l === 'zh' || l === 'en') setLang(l);
    });
  });
}

bootstrap();
