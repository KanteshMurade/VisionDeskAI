import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import Header from "../components/ui/Header";
import SectionTitle from "../components/ui/SectionTitle";
import StatusBar from "../components/ui/StatusBar";
import styles from "./Dashboard.module.css";

interface ServiceStatus {
  label: string;
  status?: string;
  value: string;
}

const serviceStatuses: readonly ServiceStatus[] = [
  { label: "AI Provider", value: "Gemini", status: "Connected" },
  { label: "OCR Engine", value: "Stopped" },
  { label: "Overlay", value: "Disabled" },
];

export default function Dashboard() {
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
                  <Badge showIndicator tone="success">{status}</Badge>
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
