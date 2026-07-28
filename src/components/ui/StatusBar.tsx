import styles from "./ui.module.css";

interface StatusBarProps {
  status: string;
}

export default function StatusBar({ status }: StatusBarProps) {
  return (
    <footer aria-label={`Application status: ${status}`} className={styles.statusBar}>
      <span aria-hidden="true" className={styles.statusIndicator} />
      <span>Status: {status}</span>
    </footer>
  );
}
