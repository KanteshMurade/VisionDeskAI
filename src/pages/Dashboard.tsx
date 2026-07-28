import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import Header from "../components/ui/Header";
import SectionTitle from "../components/ui/SectionTitle";
import StatusBar from "../components/ui/StatusBar";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useScreenshotStore } from "../stores/useScreenshotStore";
import styles from "./Dashboard.module.css";

interface ServiceStatus {
  label: string;
  status?: string;
  value: string;
}

const getServiceStatuses = (providerName: string, model: string, providerStatus: string, lastScreenshot: string): readonly ServiceStatus[] => [
  { label: "AI Provider", value: providerName, status: providerStatus },
  { label: "Current Model", value: model },
  { label: "OCR Engine", value: "Stopped" },
  { label: "Overlay", value: "Disabled" },
  { label: "Last Screenshot", value: lastScreenshot },
];

function formatLastScreenshot(timestamp: string | undefined): string {
  if (!timestamp) return "Never";
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(timestamp).getTime()) / 60_000));
  return minutes < 1 ? "Just now" : `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
}

export default function Dashboard() {
  const providers = useSettingsStore((state) => state.providers);
  const lastScreenshot = useScreenshotStore((state) => state.currentScreenshot);
  const activeProvider = providers.find((provider) => provider.status === "connected") ?? providers.find((provider) => provider.id === "gemini");
  const serviceStatuses = getServiceStatuses(activeProvider?.name ?? "Not Configured", activeProvider?.model || "Not selected", activeProvider?.status === "connected" ? "Connected" : "Not Configured", formatLastScreenshot(lastScreenshot?.timestamp));
  return (
    <div className={styles.dashboard}>
      <Header title="VisionDesk AI" subtitle="Personal AI Desktop Assistant" />

      <section aria-label="System status">
        <SectionTitle title="System status" description="Current availability of your local services." />
        <div className={styles.statusGrid}>
          {serviceStatuses.map(({ label, status, value }) => (
            <Card className={styles.statusCard} key={label}>
              <p className={styles.statusLabel}>{label}</p>
              <p className={styles.statusValue}>{value}</p>
              {status && (
                <div className={styles.statusFooter}>
                  <Badge showIndicator tone={status === "Connected" ? "success" : "warning"}>{status}</Badge>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      <div className={styles.bottomBar}>
        <StatusBar status="Ready" />
      </div>
    </div>
  );
}
