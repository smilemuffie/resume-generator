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

// 渲染器：订阅 store；lang/template/resume/colors 变化 → 自动分页重绘多个 .resume-page
export function initRenderer(container: HTMLElement): void {
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
  subscribe(draw);
}
