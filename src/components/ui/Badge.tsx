import styles from "./ui.module.css";

type BadgeTone = "success" | "warning" | "danger" | "neutral";

interface BadgeProps {
  children: string;
  showIndicator?: boolean;
  tone?: BadgeTone;
}

export default function Badge({ children, showIndicator = false, tone = "neutral" }: BadgeProps) {
  return (
    <span className={[styles.badge, styles[tone]].join(" ")}>
      {showIndicator && <span aria-hidden="true" className={styles.badgeDot} />}
      {children}
    </span>
  );
}
