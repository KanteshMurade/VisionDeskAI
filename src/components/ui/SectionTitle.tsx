import type { ReactNode } from "react";
import styles from "./ui.module.css";

interface SectionTitleProps {
  action?: ReactNode;
  description?: string;
  title: string;
}

export default function SectionTitle({ action, description, title }: SectionTitleProps) {
  return (
    <div className={styles.sectionTitle}>
      <div className={styles.sectionCopy}>
        <h2 className={styles.sectionHeading}>{title}</h2>
        {description && <p className={styles.sectionDescription}>{description}</p>}
      </div>
      {action && <div className={styles.sectionAction}>{action}</div>}
    </div>
  );
}
