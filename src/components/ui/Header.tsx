import type { ReactNode } from "react";
import styles from "./ui.module.css";

interface HeaderProps {
  actions?: ReactNode;
  subtitle?: string;
  title: string;
}

export default function Header({ actions, subtitle, title }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerCopy}>
        <h1 className={styles.headerTitle}>{title}</h1>
        {subtitle && <p className={styles.headerSubtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={styles.headerActions}>{actions}</div>}
    </header>
  );
}
