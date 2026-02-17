"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus } from "lucide-react";
import type { RubricData } from "@/types";

interface RubricTagsProps {
    rubrics: RubricData[];
    selected: string[];
    onChange: (ids: string[]) => void;
}

export function RubricTags({ rubrics, selected, onChange }: RubricTagsProps) {
    const [showPicker, setShowPicker] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setShowPicker(false);
            }
        };
        if (showPicker) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [showPicker]);

    const remove = (id: string) =>
        onChange(selected.filter((s) => s !== id));

    const add = (id: string) => {
        onChange([...selected, id]);
    };

    const selectedRubrics = rubrics.filter((r) => selected.includes(r.id));
    const availableRubrics = rubrics.filter((r) => !selected.includes(r.id));

    if (selected.length === 0 && !showPicker) {
        return (
            <div ref={ref} className="relative">
                <button
                    type="button"
                    onClick={() => setShowPicker(true)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
                >
                    <Plus className="h-4 w-4" />
                    Добавить рубрики
                </button>
                {showPicker && renderPicker()}
            </div>
        );
    }

    function renderPicker() {
        return (
            <div className="absolute bottom-full left-0 z-50 mb-2 w-72 rounded-xl border border-border bg-card p-3 shadow-2xl shadow-black/40 animate-scale-in">
                <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Добавить рубрику</p>
                {availableRubrics.length === 0 ? (
                    <p className="py-2 text-xs text-muted">Все рубрики выбраны</p>
                ) : (
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                        {availableRubrics.map((rubric) => {
                            const colorIdx = rubrics.indexOf(rubric);
                            return (
                                <button
                                    key={rubric.id}
                                    onClick={() => {
                                        add(rubric.id);
                                        if (availableRubrics.length <= 1) setShowPicker(false);
                                    }}
                                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-surface-hover hover:text-foreground"
                                >
                                    <div
                                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                                        style={{ backgroundColor: `oklch(60% 0.2 ${(colorIdx * 55 + 265) % 360})` }}
                                    />
                                    {rubric.name}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div ref={ref} className="relative flex flex-wrap items-center gap-2">
            {selectedRubrics.map((rubric) => {
                const colorIdx = rubrics.indexOf(rubric);
                const hue = (colorIdx * 55 + 265) % 360;
                return (
                    <span
                        key={rubric.id}
                        className="group flex items-center gap-1.5 rounded-full py-1 pl-3 pr-1.5 text-xs font-medium transition-all animate-scale-in"
                        style={{
                            backgroundColor: `oklch(25% 0.04 ${hue})`,
                            color: `oklch(75% 0.15 ${hue})`,
                            border: `1px solid oklch(35% 0.08 ${hue})`,
                        }}
                    >
                        <div
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: `oklch(60% 0.2 ${hue})` }}
                        />
                        {rubric.name}
                        <button
                            onClick={() => remove(rubric.id)}
                            className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full opacity-60 transition-all hover:opacity-100 hover:bg-white/10"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                );
            })}
            <button
                type="button"
                onClick={() => setShowPicker(!showPicker)}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-dashed border-border text-muted-foreground transition-all hover:border-primary/40 hover:text-primary hover:bg-primary/5"
            >
                <Plus className="h-3.5 w-3.5" />
            </button>
            {showPicker && renderPicker()}
        </div>
    );
}
