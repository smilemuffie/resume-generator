import type { TemplateId } from '../types';

// 1mm in CSS pixels at 96dpi
const MM_TO_PX = 96 / 25.4;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PAGE_WIDTH_PX = A4_WIDTH_MM * MM_TO_PX; // ≈ 793.70
const PAGE_HEIGHT_PX = A4_HEIGHT_MM * MM_TO_PX; // ≈ 1122.52
// 安全缓冲：避免亚像素溢出导致内容被裁切
const SAFE_TARGET_PX = PAGE_HEIGHT_PX - 6;

function tplClass(tid: TemplateId): string {
  return `tpl tpl-${tid}`;
}

/**
 * 将模板渲染的 HTML 切分为多个 A4 页面内容。
 * 返回值：每项为一段 .tpl HTML（不含 .resume-page 外壳），由调用方包裹。
 */
export function paginate(templateHtml: string, tid: TemplateId): string[] {
  const host = document.createElement('div');
  host.style.cssText =
    'position:absolute;left:-99999px;top:0;visibility:hidden;pointer-events:none;width:' +
    PAGE_WIDTH_PX + 'px;';
  document.body.appendChild(host);

  let pages: string[];
  try {
    if (tid === 'modern') {
      pages = paginateModern(host, templateHtml);
    } else {
      pages = paginateSingleColumn(host, templateHtml, tid);
    }
  } finally {
    host.remove();
  }

  return pages.length ? pages : [templateHtml];
}

// 单栏模板（basic / minimal）：按 .tpl 顶层子块切分
function paginateSingleColumn(host: HTMLElement, templateHtml: string, tid: TemplateId): string[] {
  const tmp = document.createElement('div');
  tmp.innerHTML = templateHtml;
  const srcRoot = tmp.querySelector<HTMLElement>('.tpl');
  if (!srcRoot) return [templateHtml];
  const blocks = Array.from(srcRoot.children).map((el) => el.cloneNode(true) as HTMLElement);
  if (!blocks.length) return [templateHtml];

  // 测量根：与真实页面同宽、同 padding，box-sizing: border-box
  const root = document.createElement('div');
  root.className = tplClass(tid);
  root.style.width = PAGE_WIDTH_PX + 'px';
  host.appendChild(root);

  const pages: HTMLElement[][] = [];
  let current: HTMLElement[] = [];

  root.innerHTML = '';
  for (const block of blocks) {
    root.appendChild(block);
    if (root.scrollHeight > SAFE_TARGET_PX && current.length) {
      pages.push(current);
      root.innerHTML = '';
      root.appendChild(block);
      current = [block];
    } else {
      current.push(block);
    }
  }
  if (current.length) pages.push(current);

  return pages.map((arr) => {
    const inner = arr.map((el) => el.outerHTML).join('');
    return `<div class="${tplClass(tid)}">${inner}</div>`;
  });
}

// 现代模板：侧边栏每页重复，主体按 .mod-main 子块切分
function paginateModern(host: HTMLElement, templateHtml: string): string[] {
  const tmp = document.createElement('div');
  tmp.innerHTML = templateHtml;
  const srcRoot = tmp.querySelector<HTMLElement>('.tpl-modern');
  if (!srcRoot) return [templateHtml];
  const sidebar = srcRoot.querySelector<HTMLElement>('.mod-sidebar');
  const main = srcRoot.querySelector<HTMLElement>('.mod-main');
  if (!sidebar || !main) return [templateHtml];

  const sidebarHTML = sidebar.innerHTML;
  const mainBlocks = Array.from(main.children).map((el) => el.cloneNode(true) as HTMLElement);

  if (!mainBlocks.length) {
    return [
      `<div class="tpl tpl-modern"><aside class="mod-sidebar">${sidebarHTML}</aside><div class="mod-main"></div></div>`
    ];
  }

  // 测量结构：.resume-page > .tpl-modern > [sidebar, main]
  const page = document.createElement('div');
  page.className = 'resume-page';
  page.style.width = PAGE_WIDTH_PX + 'px';
  page.style.height = 'auto';
  page.style.minHeight = '0';

  const mod = document.createElement('div');
  mod.className = 'tpl tpl-modern';
  mod.style.minHeight = '0'; // 覆盖 CSS 中的 min-height: 297mm，便于真实测量

  const sideProbe = document.createElement('aside');
  sideProbe.className = 'mod-sidebar';
  sideProbe.innerHTML = sidebarHTML;

  const mainProbe = document.createElement('div');
  mainProbe.className = 'mod-main';

  mod.appendChild(sideProbe);
  mod.appendChild(mainProbe);
  page.appendChild(mod);
  host.appendChild(page);

  // 侧边栏本身已超过一页 → 无法分页，回退单页
  mainProbe.innerHTML = '';
  if (page.scrollHeight >= PAGE_HEIGHT_PX) {
    return [templateHtml];
  }

  const pages: HTMLElement[][] = [];
  let current: HTMLElement[] = [];
  mainProbe.innerHTML = '';

  for (const block of mainBlocks) {
    mainProbe.appendChild(block);
    if (page.scrollHeight > SAFE_TARGET_PX && current.length) {
      pages.push(current);
      mainProbe.innerHTML = '';
      mainProbe.appendChild(block);
      current = [block];
    } else {
      current.push(block);
    }
  }
  if (current.length) pages.push(current);

  return pages.map((arr) => {
    const mainInner = arr.map((el) => el.outerHTML).join('');
    return (
      `<div class="tpl tpl-modern"><aside class="mod-sidebar">${sidebarHTML}</aside>` +
      `<div class="mod-main">${mainInner}</div></div>`
    );
  });
}
