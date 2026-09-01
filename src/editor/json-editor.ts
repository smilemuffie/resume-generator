import { EditorState } from '@codemirror/state';
import { EditorView, type ViewUpdate } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter, lintGutter } from '@codemirror/lint';
import { getResume, getState, setResumeAt, subscribe } from '../store';
import type { Resume } from '../types';

// CodeMirror 6 编辑器封装：
// - 每次有效变更 → 解析 → setResumeAt 写盘 + 通知渲染器
// - 语言切换 → 载入对应语言简历（仅 lang 变化时换文，避免内容编辑时光标跳动）

let view: EditorView | null = null;
let prevLang = getState().lang;

export function initEditor(host: HTMLElement): void {
  view = new EditorView({
    state: EditorState.create({
      doc: JSON.stringify(getResume(), null, 2),
      extensions: [
        basicSetup,
        lintGutter(),
        json(),
        linter(jsonParseLinter()),
        EditorView.lineWrapping,
        EditorView.updateListener.of(handleUpdate)
      ]
    }),
    parent: host
  });

  // 仅在语言切换时换文；内容变更不重载（避免光标跳转）
  subscribe((s) => {
    if (s.lang !== prevLang) {
      prevLang = s.lang;
      loadResumeIntoEditor(getResume());
    }
  });
}

function handleUpdate(update: ViewUpdate): void {
  if (!update.docChanged || !view) return;
  const text = update.state.doc.toString();
  try {
    const parsed = JSON.parse(text) as Resume;
    setResumeAt(getState().lang, parsed);
  } catch {
    // JSON 非法：lint 会标红，预览保留上次有效数据（store 不更新）
  }
}

export function loadResumeIntoEditor(resume: Resume): void {
  if (!view) return;
  const text = JSON.stringify(resume, null, 2);
  if (view.state.doc.toString() === text) return;
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: text }
  });
}

// 取编辑器当前文本（用于复制）
export function getEditorText(): string {
  return view ? view.state.doc.toString() : '';
}
