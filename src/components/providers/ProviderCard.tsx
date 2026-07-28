import type { ReactNode } from "react";
import Card from "../ui/Card";
import type { AIProvider } from "../../types/AIProvider";
import ProviderStatusBadge from "./ProviderStatusBadge";
import styles from "./ProviderCard.module.css";

interface ProviderCardProps {
  children?: ReactNode;
  icon: ReactNode;
  provider: AIProvider;
}

export default function ProviderCard({ children, icon, provider }: ProviderCardProps) {
  return (
    <Card className={provider.status === "disabled" ? styles.disabled : styles.card}>
      <div className={styles.heading}>
        <div className={styles.providerName}><span className={styles.icon}>{icon}</span><h2>{provider.name}</h2></div>
        <ProviderStatusBadge status={provider.status} />
      </div>
      {provider.status === "disabled" ? <p className={styles.comingSoon}>Coming Soon</p> : <div className={styles.content}>{children}</div>}
    </Card>
  );
}
