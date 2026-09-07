import type { Lang, Resume } from '../../types';
import { ageLabel, chip, dateRange, esc, icon, LABELS, listItems } from './util';

// 表格模板：单栏，工作经历以 2 列表格展示（左：公司/职位/日期，右：summary + highlights）
export function render(r: Resume, lang: Lang): string {
  const b = r.basics || ({} as Resume['basics']);
  const L = LABELS[lang];

  const contact: string[] = [];
  if (b.email) contact.push(`<span class="tab-contact-item">${icon('mail')}<a href="mailto:${esc(b.email)}" class="tab-link">${esc(b.email)}</a></span>`);
  if (b.phone) contact.push(`<span class="tab-contact-item">${icon('phone')}${esc(b.phone)}</span>`);
  if (b.gender) contact.push(`<span class="tab-contact-item">${icon('user')}${esc(b.gender)}</span>`);
  const age = ageLabel(b.birthDate, lang);
  if (age) contact.push(`<span class="tab-contact-item">${icon('clock')}${esc(age)}</span>`);
  if (b.website) contact.push(`<span class="tab-contact-item">${icon('globe')}<a href="${esc(b.website)}" class="tab-link">${esc(b.website)}</a></span>`);
  const loc = b.location ? [b.location.city, b.location.region].filter(Boolean).join(', ') : '';
  if (loc) contact.push(`<span class="tab-contact-item">${icon('pin')}${esc(loc)}</span>`);
  (b.profiles || []).filter((p) => p.url).forEach((p) => contact.push(`<span class="tab-contact-item">${icon('link')}<a href="${esc(p.url)}" class="tab-link">${esc(p.network)}</a></span>`));

  let h = `<div class="tpl tpl-tabular">`;

  // 顶部头部
  h += `<header class="tab-header">
    <div class="tab-name-row">
      <h1 class="tab-name">${esc(b.name)}</h1>
      ${b.label ? `<span class="tab-label">${esc(b.label)}</span>` : ''}
    </div>
    ${contact.length ? `<div class="tab-contact">${contact.join('<span class="tab-sep">·</span>')}</div>` : ''}
  </header>`;

  // 个人简介
  if (b.summary || (b.highlights || []).length) {
    let inner = '';
    if (b.summary) inner += `<p class="tab-summary">${b.summary}</p>`;
    if ((b.highlights || []).length) inner += `<ul class="tab-highlights tab-summary-highlights">${listItems(b.highlights!)}</ul>`;
    h += tabSection(L.summary, inner, icon('sparkles'));
  }

  // 证书
  if ((r.certificates || []).length) {
    h += tabSection(L.certificates, `<div class="tab-chips">${r.certificates.map((c) => chip(c.name, 'plain')).join('')}</div>`, icon('certificate'));
  }
  // 技能
  if ((r.skills || []).length) {
    h += tabSection(L.skills, `<div class="tab-skills">${r.skills.map((s) => {
      const kws = (s.keywords || []).map((k) => chip(k, 'plain')).join('');
      return `<div class="tab-skill"><span class="tab-skill-label">${esc(s.name)}</span>${kws ? `<span class="tab-skill-kws">${kws}</span>` : ''}</div>`;
    }).join('')}</div>`, icon('sparkles'));
  }

  // 工作经历：2 列表格
  if ((r.work || []).length) {
    const rows = r.work.map((w) => {
      const stackHtml = w.stack?.length && w.isStackShow !== false ? `<div class="tab-tbl-stack">${w.stack.map((s) => chip(s, 'accent')).join('')}</div>` : '';
      const left = `<div class="tab-tbl-cell-left">
        <div class="tab-tbl-company">${esc(w.company)}</div>
        ${stackHtml}
        ${w.position ? `<div class="tab-tbl-position">${chip(w.position, 'accent')}</div>` : ''}
        <div class="tab-tbl-date">${esc(dateRange(w.startDate, w.endDate))}</div>
      </div>`;
      let right = '';
      if (w.summary) right += `<p class="tab-tbl-summary">${w.summary}</p>`;
      if (w.highlights?.length) right += `<ul class="tab-highlights tab-tbl-highlights">${listItems(w.highlights)}</ul>`;
      const rightCell = `<div class="tab-tbl-cell-right">${right}</div>`;
      return `<div class="tab-tbl-row">${left}${rightCell}</div>`;
    }).join('');
    h += tabSection(L.work, `<div class="tab-tbl tab-tbl-work">${rows}</div>`, icon('briefcase'));
  }

  // 项目经历
  if ((r.projects || []).length) {
    h += tabSection(L.projects, r.projects.map((p) => tabProjectItem(p.name, p.url, dateRange(p.startDate, p.endDate), p.description, p.highlights, p.roles || [], p.stack || [], p.isStackShow)).join(''), icon('folder'));
  }

  // 教育
  if ((r.education || []).length) {
    h += tabSection(L.education, r.education.map((e) => tabSimpleItem(esc(e.institution), dateRange(e.startDate, e.endDate), [e.studyType, e.area, e.score].filter(Boolean).join(' · '))).join(''), icon('cap'));
  }

  // 荣誉
  if ((r.awards || []).length) {
    h += tabSection(L.awards, r.awards.map((a) => tabSimpleItem(esc(a.title), a.date, [a.awarder, a.summary].filter(Boolean).join(' · '))).join(''), icon('medal'));
  }

  // 语言
  if ((r.languages || []).length) {
    h += tabSection(L.languages, `<div class="tab-chips">${r.languages.map((l) => chip(`${l.language}${l.fluency ? ` · ${l.fluency}` : ''}`, 'plain')).join('')}</div>`, icon('translate'));
  }

  // 兴趣
  if ((r.interests || []).length) {
    h += tabSection(L.interests, `<div class="tab-chips">${r.interests.map((i) => chip(i, 'plain')).join('')}</div>`, icon('heart'));
  }

  h += `</div>`;
  return h;
}

function tabSection(title: string, inner: string, ic?: string): string {
  const iconHtml = ic ? `<span class="tab-title-icn">${ic}</span>` : '';
  return `<section class="tab-section"><h2 class="tab-section-title">${iconHtml}<span>${esc(title)}</span></h2>${inner}</section>`;
}

// 通用简单条目（教育/荣誉）
function tabSimpleItem(title: string, date: string, summary: string): string {
  return `<div class="tab-item">
    <div class="tab-item-head"><span class="tab-item-title">${title}</span>${date ? `<span class="tab-item-date">${esc(date)}</span>` : ''}</div>
    ${summary ? `<p class="tab-item-summary">${esc(summary)}</p>` : ''}
  </div>`;
}

// 项目条目（含角色tag + 链接 + highlights + 技术栈）
function tabProjectItem(title: string, url: string, date: string, description: string, highlights: string[] = [], roles: string[] = [], stack: string[] = [], isStackShow?: boolean): string {
  const rolesHtml = roles.length ? `<span class="tab-item-roles">${roles.map((rl) => chip(rl, 'accent')).join('')}</span>` : '';
  const titleHtml = url ? `<a href="${esc(url)}" class="tab-link tab-item-title">${esc(title)}</a>` : `<span class="tab-item-title">${esc(title)}</span>`;
  const stackHtml = stack.length && isStackShow !== false ? `<div class="tab-tbl-stack">${stack.map((s) => chip(s, 'accent')).join('')}</div>` : '';
  return `<div class="tab-item">
    <div class="tab-item-head">${titleHtml}${rolesHtml}${date ? `<span class="tab-item-date">${esc(date)}</span>` : ''}</div>
    ${stackHtml}
    ${description ? `<p class="tab-item-summary">${description}</p>` : ''}
    ${highlights.length ? `<ul class="tab-highlights">${listItems(highlights)}</ul>` : ''}
  </div>`;
}
