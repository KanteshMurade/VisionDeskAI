import Button from "../ui/Button";

interface TestConnectionButtonProps {
  idleLabel?: string;
  isTesting: boolean;
  onTest: () => void;
}

export default function TestConnectionButton({ idleLabel = "Test Connection", isTesting, onTest }: TestConnectionButtonProps) {
  return <Button disabled={isTesting} onClick={onTest} variant="secondary">{isTesting ? "Testing…" : idleLabel}</Button>;
}
