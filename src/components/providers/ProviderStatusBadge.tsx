import Badge from "../ui/Badge";
import type { ProviderStatus } from "../../types/ProviderStatus";

const statusDetails: Record<ProviderStatus, { label: string; tone: "success" | "warning" | "danger" | "neutral" }> = {
  connected: { label: "Connected", tone: "success" },
  failed: { label: "Failed", tone: "danger" },
  "not-configured": { label: "Not Configured", tone: "warning" },
  disabled: { label: "Disabled", tone: "neutral" },
};

interface ProviderStatusBadgeProps { status: ProviderStatus; }

export default function ProviderStatusBadge({ status }: ProviderStatusBadgeProps) {
  const detail = statusDetails[status];
  return <Badge showIndicator={status !== "disabled"} tone={detail.tone}>{detail.label}</Badge>;
}
