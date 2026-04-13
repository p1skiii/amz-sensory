export const WECHAT_ID = "AMZ_SENSORY";
export const QR_SRC = "/brand/qr.png";

export function bindWeChatTriggers() {
  const dialog = document.querySelector<HTMLDialogElement>("#wechat-dialog");
  if (!dialog) return;

  document.querySelectorAll("[data-wechat-open]").forEach(el => {
    el.addEventListener("click", () => dialog.showModal());
  });

  dialog.addEventListener("click", e => {
    const rect = dialog.getBoundingClientRect();
    const x = "clientX" in e ? (e as MouseEvent).clientX : 0;
    const y = "clientY" in e ? (e as MouseEvent).clientY : 0;
    const inDialog = rect.top <= y && y <= rect.top + rect.height && rect.left <= x && x <= rect.left + rect.width;
    if (!inDialog) dialog.close();
  });
}
