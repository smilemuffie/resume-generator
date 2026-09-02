import type { Lang, Resume } from '../../types';
import { ageLabel, chip, dateRange, esc, icon, LABELS, listItems } from './util';

// 极简模板：单栏无衬线，大留白，细点分隔，chips，单点强调
export function render(r: Resume, lang: Lang): string {
  const b = r.basics || ({} as Resume['basics']);
  const L = LABELS[lang];

  const contact: string[] = [];
  if (b.email) contact.push(`<span class="min-contact-item">${icon('mail')}<a href="mailto:${esc(b.email)}" class="min-link">${esc(b.email)}</a></span>`);
  if (b.phone) contact.push(`<span class="min-contact-item">${icon('phone')}${esc(b.phone)}</span>`);
  if (b.gender) contact.push(`<span class="min-contact-item">${icon('user')}${esc(b.gender)}</span>`);
  const age = ageLabel(b.birthDate, lang);
  if (age) contact.push(`<span class="min-contact-item">${icon('clock')}${esc(age)}</span>`);
  if (b.website) contact.push(`<span class="min-contact-item">${icon('globe')}<a href="${esc(b.website)}" class="min-link">${esc(b.website)}</a></span>`);
  const loc = b.location ? [b.location.city, b.location.region].filter(Boolean).join(', ') : '';
  if (loc) contact.push(`<span class="min-contact-item">${icon('pin')}${esc(loc)}</span>`);
  (b.profiles || []).filter((p) => p.url).forEach((p) => contact.push(`<span class="min-contact-item">${icon('link')}<a href="${esc(p.url)}" class="min-link">${esc(p.network)}</a></span>`));

  let h = `<div class="tpl tpl-minimal">`;
  h += `<header class="min-header">
    <h1 class="min-name">${esc(b.name)}</h1>
    <div class="min-name-rule"></div>
    ${b.label ? `<div class="min-label">${esc(b.label)}</div>` : ''}
    ${contact.length ? `<div class="min-contact">${contact.join('<span class="min-sep">·</span>')}</div>` : ''}
  </header>`;

  if (b.summary || (b.highlights || []).length) {
    let inner = '';
    if (b.summary) inner += `<p class="min-summary">${b.summary}</p>`;
    if ((b.highlights || []).length) inner += `<ul class="min-highlights min-summary-highlights">${listItems(b.highlights!)}</ul>`;
    h += minSection(L.summary, inner);
  }

  if ((r.certificates || []).length) {
    h += minSection(L.certificates, `<div class="min-chips">${r.certificates.map((c) => chip(c.name, 'plain')).join('')}</div>`);
  }
  if ((r.skills || []).length) {
    h += minSection(L.skills, `<div class="min-skills">${r.skills.map((s) => {
      const kws = (s.keywords || []).map((k) => chip(k, 'plain')).join('');
      return `<div class="min-skill"><span class="min-skill-label">${esc(s.name)}</span>${kws ? `<span class="min-skill-kws">${kws}</span>` : ''}</div>`;
    }).join('')}</div>`);
  }
  if ((r.work || []).length) {
    h += minSection(L.work, r.work.map((w) => minItem(esc(w.company), dateRange(w.startDate, w.endDate), w.summary, w.highlights, w.position ? [w.position] : [])).join(''));
  }
  if ((r.projects || []).length) {
    h += minSection(L.projects, r.projects.map((p) => minItem(esc(p.name), dateRange(p.startDate, p.endDate), p.description, p.highlights, p.roles || [])).join(''));
  }
  if ((r.education || []).length) {
    h += minSection(L.education, r.education.map((e) => minItem(esc(e.institution), dateRange(e.startDate, e.endDate), [e.studyType, e.area, e.score].filter(Boolean).join(' · '), [])).join(''));
  }
  if ((r.awards || []).length) {
    h += minSection(L.awards, r.awards.map((a) => minItem(esc(a.title), a.date, [a.awarder, a.summary].filter(Boolean).join(' · '), [])).join(''));
  }
  if ((r.languages || []).length) {
    h += minSection(L.languages, `<div class="min-chips">${r.languages.map((l) => chip(`${l.language}${l.fluency ? ` · ${l.fluency}` : ''}`, 'plain')).join('')}</div>`);
  }
  if ((r.interests || []).length) {
    h += minSection(L.interests, `<div class="min-chips">${r.interests.map((i) => chip(i, 'plain')).join('')}</div>`);
  }

  h += `</div>`;
  return h;
}

function minSection(title: string, inner: string): string {
  return `<section class="min-section"><h2 class="min-section-title">${esc(title)}</h2>${inner}</section>`;
}

function minItem(title: string, date: string, summary: string, highlights: string[] = [], roles: string[] = []): string {
  const rolesHtml = roles.length ? `<span class="min-item-roles">${roles.map((rl) => chip(rl, 'plain')).join('')}</span>` : '';
  return `<div class="min-item">
    <div class="min-item-head"><span class="min-item-title">${title}</span>${rolesHtml}${date ? `<span class="min-item-date">${esc(date)}</span>` : ''}</div>
    ${summary ? `<p class="min-item-summary">${summary}</p>` : ''}
    ${highlights.length ? `<ul class="min-highlights">${listItems(highlights)}</ul>` : ''}
  </div>`;
}
