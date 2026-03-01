"use client";

import { useState, useRef, type KeyboardEvent, type CompositionEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTaskStore } from "@/stores/task-store";

export function BrainDumpInput() {
  const [value, setValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const addTask = useTaskStore((s) => s.addTask);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    addTask(trimmed);
    setValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={(e: CompositionEvent) => setIsComposing(true)}
        onCompositionEnd={(e: CompositionEvent) => setIsComposing(false)}
        placeholder="할 일을 입력하세요..."
        className="flex-1"
      />
      <Button size="icon" onClick={handleSubmit} disabled={!value.trim()}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
