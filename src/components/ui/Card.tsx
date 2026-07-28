import type { HTMLAttributes, ReactNode } from "react";
import styles from "./ui.module.css";

interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export default function Card({ children, className, ...props }: CardProps) {
  const cardClassName = [styles.card, className].filter(Boolean).join(" ");

  return <section className={cardClassName} {...props}>{children}</section>;
}
