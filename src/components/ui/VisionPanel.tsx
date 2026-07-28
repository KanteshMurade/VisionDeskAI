import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Button from "./Button";
import styles from "./VisionPanel.module.css";

interface VisionPanelProps {
  imageDataUrl: string | null;
  onAnalyze: (prompt: string) => Promise<void>;
  isAnalyzing: boolean;
  analysisResult: string | null;
  error: string | null;
  onClear: () => void;
  onCopyResponse: () => void;
}

export default function VisionPanel({
  imageDataUrl,
  onAnalyze,
  isAnalyzing,
  analysisResult,
  error,
  onClear,
  onCopyResponse,
}: VisionPanelProps) {
  const [prompt, setPrompt] = useState("");

  const handleAnalyze = async () => {
    await onAnalyze(prompt);
  };

  return (
    <div className={styles.visionPanel}>
      <div className={styles.promptContainer}>
        <textarea
          aria-label="Analysis prompt"
          className={styles.promptInput}
          disabled={isAnalyzing}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Explain this error, summarize this document, describe this UI..."
          value={prompt}
        />
        <div className={styles.promptActions}>
          <Button disabled={!imageDataUrl || isAnalyzing} onClick={handleAnalyze}>
            {isAnalyzing ? "Analyzing…" : "Analyze Screenshot"}
          </Button>
          {analysisResult && (
            <Button onClick={onClear} variant="ghost">
              Clear
            </Button>
          )}
        </div>
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
      {isAnalyzing && (
        <div className={styles.loading}>
          <span className={styles.spinner} />
          Analyzing screenshot with Gemini Vision…
        </div>
      )}
      {analysisResult && (
        <div className={styles.resultContainer}>
          <div className={styles.resultPanel}>
            <div className={styles.markdown}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {analysisResult}
              </ReactMarkdown>
            </div>
          </div>
          <div className={styles.resultActions}>
            <Button onClick={onCopyResponse} variant="secondary">Copy Response</Button>
          </div>
        </div>
      )}
    </div>
  );
}
