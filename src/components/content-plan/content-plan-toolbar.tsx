"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import {
    CalendarDays,
    Clock,
    Hash,
    Sparkles,
    ChevronDown,
} from "lucide-react";
import type { SocialNetwork, AIProvider, PlanDuration } from "@/types";
import { AI_MODELS, PLAN_DURATIONS, DAYS_OF_WEEK } from "@/types";

/* ───────── Popover wrapper ───────── */
function ToolbarPopover({
    trigger,
    children,
    isOpen,
    onToggle,
    width = "w-72",
}: {
    trigger: React.ReactNode;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    width?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onToggle();
            }
        };
        if (isOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen, onToggle]);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={onToggle}
                className={cn(
                    "flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    isOpen
                        ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                        : "bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground"
                )}
            >
                {trigger}
            </button>
            {isOpen && (
                <div
                    className={cn(
                        "absolute bottom-full left-0 z-50 mb-2 rounded-xl border border-border bg-card p-4 shadow-2xl shadow-black/40 animate-scale-in",
                        width
                    )}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

/* ───────── Network styles ───────── */
const NETWORK_STYLES: Record<string, { bg: string; ring: string }> = {
    telegram: { bg: "bg-[#26A5E4]", ring: "ring-[#26A5E4]/40" },
    instagram: { bg: "bg-gradient-to-br from-[#833AB4] via-[#E4405F] to-[#FCAF45]", ring: "ring-[#E4405F]/40" },
    vk: { bg: "bg-[#0077FF]", ring: "ring-[#0077FF]/40" },
    threads: { bg: "bg-[#555]", ring: "ring-[#666]/40" },
};

/* ───────── Main Component ───────── */
interface ToolbarProps {
    networks: SocialNetwork[];
    selectedNetworks: number[];
    onNetworksChange: (ids: number[]) => void;
    startDate: string;
    onStartDateChange: (d: string) => void;
    duration: PlanDuration;
    onDurationChange: (d: PlanDuration) => void;
    postsPerWeek: number;
    publishDays: number[];
    onPostsPerWeekChange: (n: number) => void;
    onPublishDaysChange: (days: number[]) => void;
    aiProvider: AIProvider;
    aiModel: string;
    onProviderChange: (p: AIProvider) => void;
    onModelChange: (m: string) => void;
}

export function ContentPlanToolbar({
    networks,
    selectedNetworks,
    onNetworksChange,
    startDate,
    onStartDateChange,
    duration,
    onDurationChange,
    postsPerWeek,
    publishDays,
    onPostsPerWeekChange,
    onPublishDaysChange,
    aiProvider,
    aiModel,
    onProviderChange,
    onModelChange,
}: ToolbarProps) {
    const [openPanel, setOpenPanel] = useState<string | null>(null);

    const toggle = (panel: string) =>
        setOpenPanel((prev) => (prev === panel ? null : panel));

    const toggleNetwork = (id: number) =>
        onNetworksChange(
            selectedNetworks.includes(id)
                ? selectedNetworks.filter((s) => s !== id)
                : [...selectedNetworks, id]
        );

    const handlePostsChange = (value: number) => {
        onPostsPerWeekChange(value);
        if (publishDays.length > value) {
            onPublishDaysChange(publishDays.slice(0, value));
        }
    };

    const toggleDay = (day: number) => {
        if (publishDays.includes(day)) {
            onPublishDaysChange(publishDays.filter((d) => d !== day));
        } else if (publishDays.length < postsPerWeek) {
            onPublishDaysChange([...publishDays, day]);
        }
    };

    const formatDate = (d: string) => {
        const date = new Date(d);
        return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
    };

    const currentDuration = PLAN_DURATIONS.find((d) => d.value === duration);
    const currentModel = AI_MODELS.find((m) => m.id === aiModel);
    const filteredModels = AI_MODELS.filter((m) => m.provider === aiProvider);

    return (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card/50 px-3 py-2.5 backdrop-blur-sm">
            {/* ── Social Networks ── */}
            <ToolbarPopover
                isOpen={openPanel === "networks"}
                onToggle={() => toggle("networks")}
                trigger={
                    <>
                        <span className="flex items-center gap-1">
                            {selectedNetworks.length > 0 ? (
                                selectedNetworks.map((id) => {
                                    const net = networks.find((n) => n.id === id);
                                    if (!net) return null;
                                    const style = NETWORK_STYLES[net.slug];
                                    return (
                                        <span
                                            key={id}
                                            className={cn(
                                                "flex h-6 w-6 items-center justify-center rounded-full",
                                                style?.bg
                                            )}
                                        >
                                            <Icon icon={net.iconName} className="h-3.5 w-3.5 text-white" />
                                        </span>
                                    );
                                })
                            ) : (
                                <span className="text-muted">Соцсети</span>
                            )}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                    </>
                }
            >
                <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Социальные сети</p>
                <div className="grid grid-cols-2 gap-2">
                    {networks.map((net) => {
                        const isSelected = selectedNetworks.includes(net.id);
                        const style = NETWORK_STYLES[net.slug] || NETWORK_STYLES.telegram;
                        return (
                            <button
                                key={net.id}
                                onClick={() => toggleNetwork(net.id)}
                                className={cn(
                                    "flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 transition-all",
                                    isSelected
                                        ? `border-transparent ${style.bg} shadow-md ${style.ring} ring-2`
                                        : "border-border bg-surface hover:bg-surface-hover"
                                )}
                            >
                                <Icon
                                    icon={net.iconName}
                                    className={cn("h-5 w-5", isSelected ? "text-white" : "text-muted-foreground")}
                                />
                                <span className={cn("text-sm font-medium", isSelected ? "text-white" : "text-muted-foreground")}>
                                    {net.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </ToolbarPopover>

            <div className="h-5 w-px bg-border" />

            {/* ── Date ── */}
            <ToolbarPopover
                isOpen={openPanel === "date"}
                onToggle={() => toggle("date")}
                width="w-56"
                trigger={
                    <>
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span>{formatDate(startDate)}</span>
                    </>
                }
            >
                <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Дата начала</p>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                        onStartDateChange(e.target.value);
                        setOpenPanel(null);
                    }}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
            </ToolbarPopover>

            <div className="h-5 w-px bg-border" />

            {/* ── Duration ── */}
            <ToolbarPopover
                isOpen={openPanel === "duration"}
                onToggle={() => toggle("duration")}
                width="w-48"
                trigger={
                    <>
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{currentDuration?.shortLabel}</span>
                        <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                    </>
                }
            >
                <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Продолжительность</p>
                <div className="space-y-1">
                    {PLAN_DURATIONS.map((d) => (
                        <button
                            key={d.value}
                            onClick={() => {
                                onDurationChange(d.value);
                                setOpenPanel(null);
                            }}
                            className={cn(
                                "flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-sm transition-all",
                                duration === d.value
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                            )}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>
            </ToolbarPopover>

            <div className="h-5 w-px bg-border" />

            {/* ── Frequency ── */}
            <ToolbarPopover
                isOpen={openPanel === "frequency"}
                onToggle={() => toggle("frequency")}
                width="w-80"
                trigger={
                    <>
                        <Hash className="h-4 w-4 text-primary" />
                        <span>{postsPerWeek}/нед</span>
                        <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                    </>
                }
            >
                <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Частота публикаций</p>

                <div className="mb-4">
                    <p className="mb-2 text-xs text-muted-foreground">Постов в неделю</p>
                    <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                            <button
                                key={n}
                                onClick={() => handlePostsChange(n)}
                                className={cn(
                                    "flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-xs font-medium transition-all",
                                    postsPerWeek === n
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "bg-surface text-muted-foreground hover:bg-surface-hover"
                                )}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-xs text-muted-foreground">
                        Дни публикаций <span className="text-muted">({publishDays.length}/{postsPerWeek})</span>
                    </p>
                    <div className="flex gap-1.5">
                        {DAYS_OF_WEEK.map(({ value, label }) => {
                            const isSelected = publishDays.includes(value);
                            const isDisabled = !isSelected && publishDays.length >= postsPerWeek;
                            return (
                                <button
                                    key={value}
                                    onClick={() => toggleDay(value)}
                                    disabled={isDisabled}
                                    className={cn(
                                        "flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-xs font-medium transition-all",
                                        isSelected
                                            ? "bg-primary text-primary-foreground shadow-md"
                                            : isDisabled
                                                ? "bg-surface/50 text-muted cursor-not-allowed"
                                                : "bg-surface text-muted-foreground hover:bg-surface-hover"
                                    )}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </ToolbarPopover>

            <div className="h-5 w-px bg-border" />

            {/* ── AI Model ── */}
            <ToolbarPopover
                isOpen={openPanel === "ai"}
                onToggle={() => toggle("ai")}
                width="w-72"
                trigger={
                    <>
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span>{currentModel?.name || aiModel}</span>
                        <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                    </>
                }
            >
                <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">AI Модель</p>

                {/* Provider toggle */}
                <div className="mb-3 flex gap-1.5">
                    {(["openai", "anthropic"] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => {
                                onProviderChange(p);
                                const first = AI_MODELS.find((m) => m.provider === p);
                                if (first) onModelChange(first.id);
                            }}
                            className={cn(
                                "cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                                aiProvider === p
                                    ? p === "openai"
                                        ? "bg-green-500/15 text-green-400 ring-1 ring-green-500/30"
                                        : "bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30"
                                    : "bg-surface text-muted-foreground hover:bg-surface-hover"
                            )}
                        >
                            {p === "openai" ? "OpenAI" : "Anthropic"}
                        </button>
                    ))}
                </div>

                <div className="space-y-1 max-h-48 overflow-y-auto">
                    {filteredModels.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => {
                                onModelChange(m.id);
                                setOpenPanel(null);
                            }}
                            className={cn(
                                "flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left transition-all",
                                aiModel === m.id
                                    ? "bg-primary/10 text-foreground"
                                    : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                            )}
                        >
                            <span className="text-sm font-medium">{m.name}</span>
                            <span className="text-xs text-muted">{m.description}</span>
                        </button>
                    ))}
                </div>
            </ToolbarPopover>
        </div>
    );
}
