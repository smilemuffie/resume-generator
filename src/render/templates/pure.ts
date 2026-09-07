import type { Lang, Resume } from '../../types';
import { ageLabel, chip, dateRange, esc, icon, LABELS, listItems, resolveDescription } from './util';

// 纯净模板：以 minimal 为蓝本，单栏无衬线，列表项以数字编号呈现
export function render(r: Resume, lang: Lang): string {
  const b = r.basics || ({} as Resume['basics']);
  const L = LABELS[lang];

  const contact: string[] = [];
  if (b.email) contact.push(`<span class="pure-contact-item">${icon('mail')}<a href="mailto:${esc(b.email)}" class="pure-link">${esc(b.email)}</a></span>`);
  if (b.phone) contact.push(`<span class="pure-contact-item">${icon('phone')}${esc(b.phone)}</span>`);
  if (b.gender) contact.push(`<span class="pure-contact-item">${icon('user')}${esc(b.gender)}</span>`);
  const age = ageLabel(b.birthDate, lang);
  if (age) contact.push(`<span class="pure-contact-item">${icon('clock')}${esc(age)}</span>`);
  if (b.website) contact.push(`<span class="pure-contact-item">${icon('globe')}<a href="${esc(b.website)}" class="pure-link">${esc(b.website)}</a></span>`);
  const loc = b.location ? [b.location.city, b.location.region].filter(Boolean).join(', ') : '';
  if (loc) contact.push(`<span class="pure-contact-item">${icon('pin')}${esc(loc)}</span>`);
  (b.profiles || []).filter((p) => p.url).forEach((p) => contact.push(`<span class="pure-contact-item">${icon('link')}<a href="${esc(p.url)}" class="pure-link">${esc(p.network)}</a></span>`));

  let h = `<div class="tpl tpl-pure">`;
  h += `<header class="pure-header">
    <h1 class="pure-name">${esc(b.name)}</h1>
    <div class="pure-name-rule"></div>
    ${b.label ? `<div class="pure-label">${esc(b.label)}</div>` : ''}
    ${contact.length ? `<div class="pure-contact">${contact.join('<span class="pure-sep">·</span>')}</div>` : ''}
  </header>`;

  if (b.summary || (b.highlights || []).length) {
    let inner = '';
    if (b.summary) inner += `<p class="pure-summary">${b.summary}</p>`;
    if ((b.highlights || []).length) inner += `<ol class="pure-highlights pure-summary-highlights">${listItems(b.highlights!)}</ol>`;
    h += pureSection(L.summary, inner);
  }

  if ((r.certificates || []).length) {
    h += pureSection(L.certificates, `<div class="pure-chips">${r.certificates.map((c) => chip(c.name, 'plain')).join('')}</div>`);
  }
  if ((r.skills || []).length) {
    h += pureSection(L.skills, `<div class="pure-skills">${r.skills.map((s) => {
      const kws = (s.keywords || []).map((k) => chip(k, 'plain')).join('');
      return `<div class="pure-skill"><span class="pure-skill-label">${esc(s.name)}</span>${kws ? `<span class="pure-skill-kws">${kws}</span>` : ''}</div>`;
    }).join('')}</div>`);
  }
  if ((r.work || []).length) {
    h += pureSection(L.work, r.work.map((w) => pureItem(esc(w.company), dateRange(w.startDate, w.endDate), w.summary, w.highlights, w.position ? [w.position] : [], w.stack || [], w.isStackShow)).join(''));
  }
  if ((r.projects || []).length) {
    h += pureSection(L.projects, r.projects.map((p) => pureItem(esc(p.name), dateRange(p.startDate, p.endDate), resolveDescription(p.description, p.stack || []), p.highlights, p.roles || [], p.stack || [], p.isStackShow)).join(''), 'projects');
  }
  if ((r.education || []).length) {
    h += pureSection(L.education, r.education.map((e) => pureItem(esc(e.institution), dateRange(e.startDate, e.endDate), [e.studyType, e.area, e.score].filter(Boolean).join(' · '), [])).join(''));
  }
  if ((r.awards || []).length) {
    h += pureSection(L.awards, r.awards.map((a) => pureItem(esc(a.title), a.date, [a.awarder, a.summary].filter(Boolean).join(' · '), [])).join(''));
  }
  if ((r.languages || []).length) {
    h += pureSection(L.languages, `<div class="pure-chips">${r.languages.map((l) => chip(`${l.language}${l.fluency ? ` · ${l.fluency}` : ''}`, 'plain')).join('')}</div>`);
  }
  if ((r.interests || []).length) {
    h += pureSection(L.interests, `<div class="pure-chips">${r.interests.map((i) => chip(i, 'plain')).join('')}</div>`);
  }

  h += `</div>`;
  return h;
}

function pureSection(title: string, inner: string, key?: string): string {
  return `<section class="pure-section"${key ? ` data-key="${key}"` : ''}><h2 class="pure-section-title">${esc(title)}</h2>${inner}</section>`;
}

function pureItem(title: string, date: string, summary: string, highlights: string[] = [], roles: string[] = [], stack: string[] = [], isStackShow?: boolean): string {
  const rolesHtml = roles.length ? `<span class="pure-item-roles">${roles.map((rl) => chip(rl, 'plain')).join('')}</span>` : '';
  const stackHtml = stack.length && isStackShow !== false ? `<div class="pure-item-stack">${stack.map((s) => chip(s, 'accent')).join('')}</div>` : '';
  return `<div class="pure-item">
    <div class="pure-item-head"><span class="pure-item-title">${title}</span>${rolesHtml}${date ? `<span class="pure-item-date">${esc(date)}</span>` : ''}</div>
    ${stackHtml}
    ${summary ? `<p class="pure-item-summary">${summary}</p>` : ''}
    ${highlights.length ? `<ol class="pure-highlights">${listItems(highlights)}</ol>` : ''}
  </div>`;
}
