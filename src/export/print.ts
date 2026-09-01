// 导出 PDF：触发浏览器打印对话框（打印当前语言简历）
export function initExport(btn: HTMLButtonElement): void {
  btn.addEventListener('click', () => {
    window.print();
  });
}
