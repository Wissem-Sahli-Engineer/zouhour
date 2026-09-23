import html2canvas from "html2canvas";

// Captures whatever is currently rendered in the app window — no OS/browser
// permission prompt, since it only rasterizes the page's own DOM (it can't
// see other apps or windows, unlike a real screen-share capture).
export async function captureScreenshot() {
  const canvas = await html2canvas(document.body, {
    backgroundColor: "#ffffff",
    scale: Math.min(window.devicePixelRatio || 1, 2),
    useCORS: true,
    logging: false,
  });
  return canvas.toDataURL("image/png");
}
