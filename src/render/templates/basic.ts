import type { Lang, Resume } from '../../types';
import { ageLabel, chip, dateRange, esc, icon, LABELS, listItems } from './util';

// 基础模板：单栏衬线，传统专业风（钢蓝强调色）
export function render(r: Resume, lang: Lang): string {
  const b = r.basics || ({} as Resume['basics']);
  const L = LABELS[lang];

  // 联系行（带图标）
  const contact: string[] = [];
  if (b.email) contact.push(`<span class="r-contact-item">${icon('mail')}<a href="mailto:${esc(b.email)}" class="r-link">${esc(b.email)}</a></span>`);
  if (b.phone) contact.push(`<span class="r-contact-item">${icon('phone')}${esc(b.phone)}</span>`);
  if (b.gender) contact.push(`<span class="r-contact-item">${icon('user')}${esc(b.gender)}</span>`);
  const age = ageLabel(b.birthDate, lang);
  if (age) contact.push(`<span class="r-contact-item">${icon('clock')}${esc(age)}</span>`);
  if (b.website) contact.push(`<span class="r-contact-item">${icon('globe')}<a href="${esc(b.website)}" class="r-link">${esc(b.website)}</a></span>`);
  const loc = b.location ? [b.location.city, b.location.region].filter(Boolean).join(', ') : '';
  if (loc) contact.push(`<span class="r-contact-item">${icon('pin')}${esc(loc)}</span>`);
  const profiles = (b.profiles || [])
    .filter((p) => p.url)
    .map((p) => `<span class="r-contact-item">${icon('link')}<a href="${esc(p.url)}" class="r-link">${esc(p.network)}</a></span>`)
    .join('');

  let h = `<div class="tpl tpl-basic">`;
  h += `<header class="r-header">
    <h1 class="r-name">${esc(b.name)}</h1>
    ${b.label ? `<div class="r-label">${esc(b.label)}</div>` : ''}
    ${contact.length ? `<div class="r-contact">${contact.join('<span class="r-sep">·</span>')}</div>` : ''}
    ${profiles ? `<div class="r-contact">${profiles}</div>` : ''}
  </header>`;

  if (b.summary || (b.highlights || []).length) {
    let inner = '';
    if (b.summary) inner += `<p class="r-summary">${b.summary}</p>`;
    if ((b.highlights || []).length) inner += `<ul class="r-highlights r-summary-highlights">${listItems(b.highlights!)}</ul>`;
    h += section(L.summary, 'sparkles', inner);
  }

  if ((r.work || []).length) {
    h += section(L.work, 'briefcase', r.work.map((w) => item(
      esc(w.company),
      dateRange(w.startDate, w.endDate),
      w.summary,
      w.highlights,
      w.position ? [w.position] : []
    )).join(''));
  }

  if ((r.projects || []).length) {
    h += section(L.projects, 'folder', r.projects.map((p) => item(
      esc(p.name),
      dateRange(p.startDate, p.endDate),
      p.description,
      p.highlights,
      p.roles || []
    )).join(''));
  }

  if ((r.education || []).length) {
    h += section(L.education, 'cap', r.education.map((e) => item(
      esc(e.institution),
      dateRange(e.startDate, e.endDate),
      [e.studyType, e.area, e.score].filter(Boolean).join(' · '),
      []
    )).join(''));
  }

  if ((r.certificates || []).length) {
    h += section(L.certificates, 'certificate', r.certificates.map((c) => item(
      esc(c.name),
      c.date,
      [c.issuer, c.summary].filter(Boolean).join(' · '),
      []
    )).join(''));
  }

  if ((r.skills || []).length) {
    h += section(L.skills, 'sparkles', `<div class="r-skills">${r.skills.map((s) => {
      const kws = (s.keywords || []).map((k) => chip(k, 'plain')).join('');
      return `<div class="r-skill">${chip(s.name, 'accent')}${kws ? `<span class="r-skill-kws">${kws}</span>` : ''}</div>`;
    }).join('')}</div>`);
  }

  if ((r.awards || []).length) {
    h += section(L.awards, 'medal', r.awards.map((a) => item(
      esc(a.title),
      a.date,
      [a.awarder, a.summary].filter(Boolean).join(' · '),
      []
    )).join(''));
  }

  if ((r.languages || []).length) {
    h += section(L.languages, 'translate', `<div class="r-langs">${r.languages.map((l) => chip(`${l.language}${l.fluency ? ` · ${l.fluency}` : ''}`, 'plain')).join('')}</div>`);
  }

  if ((r.interests || []).length) {
    h += section(L.interests, 'heart', `<div class="r-interests">${r.interests.map((i) => chip(i, 'plain')).join('')}</div>`);
  }

  h += `</div>`;
  return h;
}

function section(title: string, ic: Parameters<typeof icon>[0], inner: string): string {
  return `<section class="r-section">
    <h2 class="r-section-title">${icon(ic)}<span>${esc(title)}</span></h2>
    ${inner}
  </section>`;
}

function item(title: string, date: string, summary: string, highlights: string[] = [], roles: string[] = []): string {
  const rolesHtml = roles.length ? `<span class="r-item-roles">${roles.map((rl) => chip(rl, 'plain')).join('')}</span>` : '';
  return `<div class="r-item">
    <div class="r-item-head">
      <span class="r-item-title">${title}</span>
      ${rolesHtml}
      ${date ? `<span class="r-item-date">${esc(date)}</span>` : ''}
    </div>
    ${summary ? `<p class="r-item-summary">${summary}</p>` : ''}
    ${highlights.length ? `<ul class="r-highlights">${listItems(highlights)}</ul>` : ''}
  </div>`;
}
