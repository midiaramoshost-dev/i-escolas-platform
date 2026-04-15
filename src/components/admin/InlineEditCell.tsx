import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

interface InlineEditCellProps {
  value: string | number;
  field: string;
  type?: "text" | "number" | "select";
  options?: { value: string; label: string }[];
  onSave: (field: string, value: string | number) => void;
  className?: string;
  children: React.ReactNode;
}

export function InlineEditCell({
  value,
  field,
  type = "text",
  options,
  onSave,
  className,
  children,
}: InlineEditCellProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    setEditValue(String(value));
  }, [value]);

  const handleSave = () => {
    const finalValue = type === "number" ? Number(editValue) : editValue;
    if (finalValue !== value) {
      onSave(field, finalValue);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditValue(String(value));
      setEditing(false);
    }
  };

  if (editing && type === "select" && options) {
    return (
      <Select
        value={editValue}
        onValueChange={(v) => {
          setEditValue(v);
          const finalValue = v;
          if (finalValue !== value) onSave(field, v);
          setEditing(false);
        }}
        open={true}
        onOpenChange={(open) => {
          if (!open) setEditing(false);
        }}
      >
        <SelectTrigger className="h-8 w-full min-w-[90px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (editing) {
    return (
      <Input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        type={type === "number" ? "number" : "text"}
        className="h-8 min-w-[60px] text-xs"
      />
    );
  }

  return (
    <div
      className={cn(
        "group/cell cursor-pointer rounded px-1 py-0.5 transition-colors hover:bg-muted/60 flex items-center gap-1",
        className
      )}
      onClick={() => setEditing(true)}
      title="Clique para editar"
    >
      <div className="flex-1">{children}</div>
      <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover/cell:opacity-100 transition-opacity shrink-0" />
    </div>
  );
}
