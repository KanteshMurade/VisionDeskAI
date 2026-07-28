interface APIKeyInputProps {
  label: string;
  onChange: (value: string) => void;
  value: string;
}

export default function APIKeyInput({ label, onChange, value }: APIKeyInputProps) {
  return (
    <label>
      <span>{label}</span>
      <input autoComplete="off" onChange={(event) => onChange(event.target.value)} placeholder="Enter API key" type="password" value={value} />
    </label>
  );
}
