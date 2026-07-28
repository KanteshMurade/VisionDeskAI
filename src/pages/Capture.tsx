import { useState } from "react";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import SectionTitle from "../components/ui/SectionTitle";
import { screenshotService } from "../services/ScreenshotService";
import { ocrService } from "../services/OCRService";
import { useScreenshotStore } from "../stores/useScreenshotStore";
import { useOCRStore } from "../stores/useOCRStore";
import { useChatStore } from "../stores/useChatStore";
import type { ChatMessage } from "../types/ChatMessage";
import styles from "./Capture.module.css";

export default function Capture() {
  const screenshot = useScreenshotStore((state) => state.currentScreenshot);
  const setScreenshot = useScreenshotStore((state) => state.setScreenshot);
  const clearScreenshot = useScreenshotStore((state) => state.clearScreenshot);
  const extractedText = useOCRStore((state) => state.extractedText);
  const setExtractedText = useOCRStore((state) => state.setExtractedText);
  const isProcessingOCR = useOCRStore((state) => state.isProcessing);
  const setIsProcessingOCR = useOCRStore((state) => state.setIsProcessing);
  const ocrError = useOCRStore((state) => state.error);
  const setOCRError = useOCRStore((state) => state.setError);
  const clearOCR = useOCRStore((state) => state.clear);
  const addMessage = useChatStore((state) => state.addMessage);
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

  const extractText = async () => {
    if (!screenshot) return;
    setIsProcessingOCR(true);
    setOCRError(null);
    try {
      const text = await ocrService.recognizeText(screenshot.imageDataUrl);
      setExtractedText(text);
    } catch (caught: unknown) {
      setOCRError(caught instanceof Error ? caught.message : "OCR extraction failed.");
    } finally {
      setIsProcessingOCR(false);
    }
  };

  const copyText = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Failed to copy text.");
    }
  };

  const clearText = () => {
    clearOCR();
  };

  const analyzeWithGemini = () => {
    if (!extractedText) return;
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: extractedText,
    };
    addMessage(userMessage);
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
      {screenshot && (
        <section aria-label="OCR extraction">
          <SectionTitle title="Extract Text" />
          <div className={styles.ocrActions}>
            <Button disabled={isProcessingOCR} onClick={extractText}>
              {isProcessingOCR ? "Processing…" : "Extract Text"}
            </Button>
          </div>
          {ocrError && <p className={styles.error} role="alert">{ocrError}</p>}
          {extractedText && (
            <div className={styles.ocrResult}>
              <div className={styles.ocrTextPanel}>
                <pre className={styles.ocrText}>{extractedText}</pre>
              </div>
              <div className={styles.ocrTextActions}>
                <Button onClick={copyText} variant="secondary">Copy Text</Button>
                <Button onClick={clearText} variant="ghost">Clear</Button>
                <Button onClick={analyzeWithGemini}>Analyze with Gemini</Button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
