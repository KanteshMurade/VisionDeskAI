import { useState } from "react";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import SectionTitle from "../components/ui/SectionTitle";
import { screenshotService } from "../services/ScreenshotService";
import { useScreenshotStore } from "../stores/useScreenshotStore";
import styles from "./Capture.module.css";

export default function Capture() {
  const screenshot = useScreenshotStore((state) => state.currentScreenshot);
  const setScreenshot = useScreenshotStore((state) => state.setScreenshot);
  const clearScreenshot = useScreenshotStore((state) => state.clearScreenshot);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAction = async (action: () => Promise<void>) => {
    setError(null);
    try { await action(); } catch (caught: unknown) { setError(caught instanceof Error ? caught.message : "Screenshot action failed."); }
  };
  const capture = async () => {
    setIsCapturing(true);
    await runAction(async () => setScreenshot(await screenshotService.captureFullScreen()));
    setIsCapturing(false);
  };
  const deleteScreenshot = async () => {
    if (!screenshot) return;
    await runAction(async () => { await screenshotService.deleteScreenshot(screenshot.imagePath); clearScreenshot(); });
  };

  return (
    <div className={styles.page}>
      <Header title="Screenshot" subtitle="Capture your desktop." />
      <section aria-label="Capture actions"><div className={styles.captureActions}><Button disabled={isCapturing} onClick={capture}>{isCapturing ? "Capturing…" : "Capture Full Screen"}</Button><Button disabled variant="secondary">Capture Region (Coming Soon)</Button></div></section>
      <section aria-label="Screenshot preview"><SectionTitle title="Preview" /><div className={styles.preview}>{screenshot ? <img alt="Latest desktop capture" src={screenshot.imageDataUrl} /> : <p className={styles.empty}>Screenshot Preview</p>}</div></section>
      {screenshot && <p className={styles.timestamp}>Captured {new Date(screenshot.timestamp).toLocaleString()}</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      <div className={styles.previewActions}>
        <Button disabled={!screenshot} onClick={() => runAction(async () => { if (screenshot) await screenshotService.saveScreenshot(screenshot.imageDataUrl); })} variant="secondary">Save</Button>
        <Button disabled={!screenshot} onClick={() => runAction(async () => { if (screenshot) await screenshotService.copyToClipboard(screenshot.imageDataUrl); })} variant="secondary">Copy</Button>
        <Button disabled={!screenshot} onClick={deleteScreenshot} variant="ghost">Delete</Button>
      </div>
    </div>
  );
}
