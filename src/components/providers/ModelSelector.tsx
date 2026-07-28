interface ModelSelectorProps {
  label?: string;
  models: readonly string[];
  onChange: (value: string) => void;
  value: string;
}

export default function ModelSelector({ label = "Model", models, onChange, value }: ModelSelectorProps) {
  return (
    <label>
      <span>{label}</span>
      <select onChange={(event) => onChange(event.target.value)} value={value}>
        {models.map((model) => <option key={model} value={model}>{model}</option>)}
      </select>
    </label>
  );
}
