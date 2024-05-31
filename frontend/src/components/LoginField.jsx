import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginField = ({ id, label, value, onChange, type, isMatched = true }) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      value={value}
      onChange={onChange}
      type={type}
      required
      className={
        !isMatched ? "border-red-500 ring-red-500 focus-visible:ring-red" : ""
      }
    />
  </div>
);

export default LoginField;
