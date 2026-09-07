import type { Lang, Resume } from '../../types';
import { ageLabel, chip, dateRange, esc, icon, LABELS, listItems, resolveDescription } from './util';

// 现代模板：左 35% 深色渐变侧边栏 + 右 65% 主体（蓝色强调）
export function render(r: Resume, lang: Lang): string {
  const b = r.basics || ({} as Resume['basics']);
  const L = LABELS[lang];

  // 侧边栏
  let side = `<div class="mod-name">${esc(b.name)}</div>`;
  if (b.label) side += `<div class="mod-label">${esc(b.label)}</div>`;
  side += `<div class="mod-name-rule"></div>`;

  // 联系方式（图标）
  const contact: string[] = [];
  if (b.email) contact.push(`<div class="mod-contact-row">${icon('mail')}<a href="mailto:${esc(b.email)}" class="mod-link">${esc(b.email)}</a></div>`);
  if (b.phone) contact.push(`<div class="mod-contact-row">${icon('phone')}<span>${esc(b.phone)}</span></div>`);
  if (b.gender) contact.push(`<div class="mod-contact-row">${icon('user')}<span>${esc(b.gender)}</span></div>`);
  const age = ageLabel(b.birthDate, lang);
  if (age) contact.push(`<div class="mod-contact-row">${icon('clock')}<span>${esc(age)}</span></div>`);
  if (b.website) contact.push(`<div class="mod-contact-row">${icon('globe')}<a href="${esc(b.website)}" class="mod-link">${esc(b.website)}</a></div>`);
  const loc = b.location ? [b.location.city, b.location.region].filter(Boolean).join(', ') : '';
  if (loc) contact.push(`<div class="mod-contact-row">${icon('pin')}<span>${esc(loc)}</span></div>`);
  (b.profiles || []).filter((p) => p.url).forEach((p) => contact.push(`<div class="mod-contact-row">${icon('link')}<a href="${esc(p.url)}" class="mod-link">${esc(p.network)}</a></div>`));
  if (contact.length) side += sideBlock(lang === 'zh' ? '联系方式' : 'Contact', 'link', contact.join(''));

  if ((r.skills || []).length) {
    side += sideBlock(L.skills, 'sparkles', r.skills.map((s) => {
      const kws = (s.keywords || []).map((k) => chip(k, 'plain')).join('');
      return `<div class="mod-skill"><span class="mod-skill-label">${esc(s.name)}</span>${kws ? `<span class="mod-skill-kws">${kws}</span>` : ''}</div>`;
    }).join(''));
  }

  if ((r.languages || []).length) {
    side += sideBlock(L.languages, 'translate', r.languages.map((l) => `<div class="mod-lang"><span>${esc(l.language)}</span>${l.fluency ? `<span class="mod-lang-flu">${esc(l.fluency)}</span>` : ''}</div>`).join(''));
  }

  if ((r.interests || []).length) {
    side += sideBlock(L.interests, 'heart', `<div class="mod-int-chips">${r.interests.map((i) => chip(i, 'plain')).join('')}</div>`);
  }

  if ((r.awards || []).length) {
    side += sideBlock(L.awards, 'medal', r.awards.map((a) => `<div class="mod-award"><div class="mod-award-t">${esc(a.title)}</div><div class="mod-award-d">${esc(dateRange(a.date, ''))}${a.awarder ? ` · ${esc(a.awarder)}` : ''}</div></div>`).join(''));
  }

  // 主体
  let main = '';
  if (b.summary || (b.highlights || []).length) {
    let inner = '';
    if (b.summary) inner += `<p class="mod-summary">${b.summary}</p>`;
    if ((b.highlights || []).length) inner += `<ul class="mod-highlights mod-summary-highlights">${listItems(b.highlights!)}</ul>`;
    main += `<section class="mod-block"><h2 class="mod-title">${icon('sparkles')}<span>${esc(L.summary)}</span></h2>${inner}</section>`;
  }

  if ((r.work || []).length) {
    main += modSection(L.work, 'briefcase', r.work.map((w) => modItem(esc(w.company), dateRange(w.startDate, w.endDate), w.summary, w.highlights, w.position ? [w.position] : [], w.stack || [], w.isStackShow)).join(''));
  }

  if ((r.projects || []).length) {
    main += modSection(L.projects, 'folder', r.projects.map((p) => modItem(esc(p.name), dateRange(p.startDate, p.endDate), resolveDescription(p.description, p.stack || []), p.highlights, p.roles || [], p.stack || [], p.isStackShow)).join(''), 'projects');
  }

  if ((r.education || []).length) {
    main += modSection(L.education, 'cap', r.education.map((e) => modItem(esc(e.institution), dateRange(e.startDate, e.endDate), [e.studyType, e.area, e.score].filter(Boolean).join(' · '), [])).join(''));
  }

  if ((r.certificates || []).length) {
    main += modSection(L.certificates, 'certificate', `<div class="mod-chips">${r.certificates.map((c) => chip(c.name, 'plain')).join('')}</div>`);
  }

  return `<div class="tpl tpl-modern">
    <aside class="mod-sidebar">${side}</aside>
    <div class="mod-main">${main}</div>
  </div>`;
}

function sideBlock(title: string, ic: Parameters<typeof icon>[0], inner: string): string {
  return `<div class="mod-side-block"><h3 class="mod-side-title">${icon(ic)}<span>${esc(title)}</span></h3>${inner}</div>`;
}

function modSection(title: string, ic: Parameters<typeof icon>[0], inner: string): string {
  return `<section class="mod-block"><h2 class="mod-title">${icon(ic)}<span>${esc(title)}</span></h2>${inner}</section>`;
}

function modItem(title: string, date: string, summary: string, highlights: string[] = [], roles: string[] = [], stack: string[] = [], isStackShow?: boolean): string {
  const rolesHtml = roles.length ? `<span class="mod-item-roles">${roles.map((rl) => chip(rl, 'accent')).join('')}</span>` : '';
  const stackHtml = stack.length && isStackShow !== false ? `<div class="mod-item-stack">${stack.map((s) => chip(s, 'accent')).join('')}</div>` : '';
  return `<div class="mod-item">
    <div class="mod-item-head"><span class="mod-item-title">${title}</span>${rolesHtml}${date ? `<span class="mod-item-date pill">${esc(date)}</span>` : ''}</div>
    ${stackHtml}
    ${summary ? `<p class="mod-item-summary">${summary}</p>` : ''}
    ${highlights.length ? `<ul class="mod-highlights">${listItems(highlights)}</ul>` : ''}
  </div>`;
}
