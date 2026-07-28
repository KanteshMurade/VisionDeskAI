import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./ui.module.css";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

export default function Button({
  children,
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const buttonClassName = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return <button className={buttonClassName} type={type} {...props}>{children}</button>;
}
