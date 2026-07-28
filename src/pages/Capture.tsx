import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import SectionTitle from "../components/ui/SectionTitle";
import VisionPanel from "../components/ui/VisionPanel";
import { screenshotService } from "../services/ScreenshotService";
import { ocrService } from "../services/OCRService";
import { visionService } from "../services/VisionService";
import { useScreenshotStore } from "../stores/useScreenshotStore";
import { useOCRStore } from "../stores/useOCRStore";
import { useVisionStore } from "../stores/useVisionStore";
import type { Screenshot } from "../types/Screenshot";
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
  const analysisResult = useVisionStore((state) => state.analysisResult);
  const setAnalysisResult = useVisionStore((state) => state.setAnalysisResult);
  const isAnalyzing = useVisionStore((state) => state.isAnalyzing);
  const setIsAnalyzing = useVisionStore((state) => state.setIsAnalyzing);
  const visionError = useVisionStore((state) => state.error);
  const setVisionError = useVisionStore((state) => state.setError);
  const clearVision = useVisionStore((state) => state.clear);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleRegionCaptureComplete = (_event: Electron.IpcRendererEvent, data: Screenshot) => {
      setScreenshot(data);
      setIsCapturing(false);
    };

    window.ipcRenderer.on('region-capture:complete', handleRegionCaptureComplete);

    return () => {
      window.ipcRenderer.off('region-capture:complete', handleRegionCaptureComplete);
    };
  }, [setScreenshot]);

  const runAction = async (action: () => Promise<void>) => {
    setError(null);
    try { await action(); } catch (caught: unknown) { setError(caught instanceof Error ? caught.message : "Screenshot action failed."); }
  };
  const capture = async () => {
    setIsCapturing(true);
    await runAction(async () => setScreenshot(await screenshotService.captureFullScreen()));
    setIsCapturing(false);
  };

  const captureRegion = async () => {
    setIsCapturing(true);
    await runAction(async () => {
      await screenshotService.startRegionCapture();
    });
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

  const analyzeScreenshot = async (prompt: string) => {
    if (!screenshot) return;
    setIsAnalyzing(true);
    setVisionError(null);
    try {
      const result = await visionService.analyzeScreenshot(screenshot.imageDataUrl, extractedText, prompt);
      setAnalysisResult(result);
    } catch (caught: unknown) {
      setVisionError(caught instanceof Error ? caught.message : "Vision analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyResponse = async () => {
    if (!analysisResult) return;
    try {
      await navigator.clipboard.writeText(analysisResult);
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Failed to copy response.");
    }
  };

  return (
    <div className={styles.page}>
      <Header title="Screenshot" subtitle="Capture your desktop." />
      <section aria-label="Capture actions"><div className={styles.captureActions}><Button disabled={isCapturing} onClick={capture}>{isCapturing ? "Capturing…" : "Capture Full Screen"}</Button><Button disabled={isCapturing} onClick={captureRegion} variant="secondary">{isCapturing ? "Capturing…" : "Capture Region"}</Button></div></section>
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
          <SectionTitle title="OCR" />
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
              </div>
            </div>
          )}
        </section>
      )}
      <section aria-label="AI Analysis">
        <SectionTitle title="AI Analysis" />
        <VisionPanel
          imageDataUrl={screenshot?.imageDataUrl ?? null}
          onAnalyze={analyzeScreenshot}
          isAnalyzing={isAnalyzing}
          analysisResult={analysisResult}
          error={visionError}
          onClear={clearVision}
          onCopyResponse={copyResponse}
        />
      </section>
    </div>
  );
}
