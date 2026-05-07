import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


type AuthFieldProps = {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
};



function AuthField({
  id,
  label,
  type,
  value,
  placeholder,
  error,
  onChange,
  onBlur,
}: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <Input
        id={id}
        name={id}
        type={type}
        value={value}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {error ? (
        <p id={`${id}-error`} className="text-sm text-(--color-danger)">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default AuthField;
