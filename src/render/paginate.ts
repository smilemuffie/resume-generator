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

// 单栏模板（basic / minimal）：按 .tpl 顶层子块切分；
// 当单个 section 过高时，进一步按其内部 item 切分，跨页重复区块标题。
function paginateSingleColumn(host: HTMLElement, templateHtml: string, tid: TemplateId): string[] {
  const tmp = document.createElement('div');
  tmp.innerHTML = templateHtml;
  const srcRoot = tmp.querySelector<HTMLElement>('.tpl');
  if (!srcRoot) return [templateHtml];

  // 测量根：与真实页面同宽、同 padding（border-box），测量高度含页内边距
  const root = document.createElement('div');
  root.className = tplClass(tid);
  root.style.width = PAGE_WIDTH_PX + 'px';
  host.appendChild(root);

  // 第一遍：将过高的 section 按 item 拆分为多个 chunk-section unit
  const units: HTMLElement[] = [];
  for (const block of Array.from(srcRoot.children)) {
    const el = block as HTMLElement;
    root.innerHTML = '';
    root.appendChild(el);
    if (root.scrollHeight <= SAFE_TARGET_PX) {
      units.push(el);
    } else {
      units.push(...splitSectionIntoChunks(el, root));
    }
  }

  // 第二遍：把 unit 依次装入页面，超出则换页
  const pages: HTMLElement[][] = [];
  let current: HTMLElement[] = [];
  for (const unit of units) {
    current.push(unit);
    root.innerHTML = '';
    current.forEach((e) => root.appendChild(e));
    if (root.scrollHeight > SAFE_TARGET_PX && current.length > 1) {
      current.pop();
      pages.push(current);
      current = [unit];
    }
  }
  if (current.length) pages.push(current);

  root.innerHTML = '';
  return pages.map((arr) => {
    const inner = arr.map((e) => e.outerHTML).join('');
    return `<div class="${tplClass(tid)}">${inner}</div>`;
  });
}

// 将过高的 section 按其子项拆分；区块标题（首个子元素）仅在首个 chunk 出现一次。
function splitSectionIntoChunks(section: HTMLElement, root: HTMLElement): HTMLElement[] {
  const children = Array.from(section.children);
  if (children.length <= 1) return [section];

  const titleSrc = children[0];
  const items = children.slice(1);

  // 探针 section：同 class，放进 root(.tpl) 测量，含真实 padding/margin
  const probe = document.createElement(section.tagName);
  probe.className = section.className;
  root.innerHTML = '';
  root.appendChild(probe);

  const chunks: HTMLElement[] = [];
  let cur: HTMLElement[] = [];
  let hasTitle = false; // 当前 chunk 是否含区块标题

  // 开启新 chunk；首个 chunk 带标题（仅展示一次），后续不带
  const startChunk = (withTitle: boolean) => {
    cur = [];
    probe.innerHTML = '';
    if (withTitle) {
      const t = titleSrc.cloneNode(true) as HTMLElement;
      cur.push(t);
      probe.appendChild(t);
    }
    hasTitle = withTitle;
  };

  startChunk(true);

  for (const item of items) {
    const itemClone = item.cloneNode(true) as HTMLElement;
    probe.appendChild(itemClone);
    cur.push(itemClone);
    if (root.scrollHeight > SAFE_TARGET_PX) {
      // 除当前 item 外，是否仍有有意义内容可单独成页（避免只剩空标题）
      const keepAfterPop = hasTitle ? cur.length > 2 : cur.length > 1;
      if (keepAfterPop) {
        cur.pop();
        probe.removeChild(itemClone);
        chunks.push(buildSection(section, cur));
        startChunk(false);
        probe.appendChild(itemClone);
        cur.push(itemClone);
      } else {
        // 当前 item 单独即超页：作为独立 chunk（首个 chunk 保留其标题）
        chunks.push(buildSection(section, cur));
        startChunk(false);
      }
    }
  }
  // 收尾：有内容才推（含标题但无 item 不推，避免空标题块）
  const shouldPush = hasTitle ? cur.length > 1 : cur.length > 0;
  if (shouldPush) chunks.push(buildSection(section, cur));

  root.innerHTML = '';
  return chunks.length ? chunks : [section];
}

// 用原 section 的标签与 class 构造一个 chunk section，并把给定子元素移入
function buildSection(srcSection: HTMLElement, children: HTMLElement[]): HTMLElement {
  const sec = document.createElement(srcSection.tagName);
  sec.className = srcSection.className;
  sec.append(...children);
  return sec;
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
