"use client";

import { useRef, useEffect } from "react";
import { Sparkles, SendHorizontal } from "lucide-react";

interface ChatInputProps {
    value: string;
    onChange: (v: string) => void;
    onSubmit: () => void;
    isPending: boolean;
    disabled?: boolean;
}

export function ChatInput({ value, onChange, onSubmit, isPending, disabled }: ChatInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 200) + "px";
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!isPending && !disabled) onSubmit();
        }
    };

    return (
        <div className="relative flex items-end gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3 shadow-lg shadow-black/20 backdrop-blur-sm transition-all focus-within:border-primary/40 focus-within:shadow-primary/5">
            {/* Glow effect */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 transition-opacity focus-within:opacity-100" />

            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Опишите тему контент-плана... Например: «Контент для фитнес-студии с акцентом на мотивацию и результаты клиентов»"
                rows={1}
                disabled={isPending}
                className="min-h-[44px] max-h-[200px] flex-1 resize-none bg-transparent text-sm text-foreground placeholder-muted outline-none disabled:opacity-50"
            />

            <button
                onClick={onSubmit}
                disabled={isPending || disabled}
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/40 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
                {isPending ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                    <SendHorizontal className="h-4 w-4" />
                )}
            </button>
        </div>
    );
}
