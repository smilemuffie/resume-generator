import { getState, getResume, subscribe } from '../store';
import { getThemePair } from '../theme';
import type { Lang, Resume, TemplateId } from '../types';
import { render as renderBasic } from './templates/basic';
import { render as renderModern } from './templates/modern';
import { render as renderMinimal } from './templates/minimal';
import { paginate } from './paginate';

type TemplateFn = (r: Resume, lang: Lang) => string;

const TEMPLATES: Record<TemplateId, TemplateFn> = {
  basic: renderBasic,
  modern: renderModern,
  minimal: renderMinimal
};

// A4 页面宽度（210mm @ 96dpi）
const A4_WIDTH_PX = (210 * 96) / 25.4;

// 渲染器：订阅 store；lang/template/resume/colors 变化 → 自动分页重绘多个 .resume-page
export function initRenderer(container: HTMLElement): void {
  // 按预览容器可用宽度计算缩放比例，使 A4 页面在屏幕中适配展示（不放大，只缩放）；
  // 打印时由 print.css 重置 zoom:1，恢复真实 A4 尺寸
  const updateScale = () => {
    const cs = getComputedStyle(container);
    const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const available = container.clientWidth - padX;
    const scale = Math.max(0.2, Math.min(1, available / A4_WIDTH_PX));
    container.style.setProperty('--page-scale', scale.toFixed(3));
  };

  const draw = () => {
    const s = getState();
    const fn = TEMPLATES[s.template];
    const html = fn(getResume(), s.lang);
    const pages = paginate(html, s.template);
    container.innerHTML = pages
      .map((p) => `<div class="resume-page">${p}</div>`)
      .join('');
    // 应用当前模板绑定的主题色（覆盖 .tpl-xxx 默认 --accent / --accent-soft / --bg-soft）
    const pair = getThemePair(s.colors[s.template]);
    container.querySelectorAll<HTMLElement>('.tpl').forEach((el) => {
      el.style.setProperty('--accent', pair.accent);
      el.style.setProperty('--accent-soft', pair.soft);
      el.style.setProperty('--bg-soft', pair.soft);
    });
  };

  draw();
  updateScale();
  subscribe(draw);

  // 容器尺寸变化时重新计算缩放
  const ro = new ResizeObserver(updateScale);
  ro.observe(container);
  window.addEventListener('resize', updateScale);
}
