"use client";

import { useState, useTransition } from "react";
import {
    FileText,
    MessageSquareText,
    Save,
    Loader2,
    Check,
    BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updateBriefText, updateCommunicationStyles } from "@/actions/knowledge";
import { toast } from "sonner";

type Tab = "brief" | "styles";

interface KnowledgeEditorProps {
    briefText: string | null;
    communicationStyles: string | null;
}

export function KnowledgeEditor({ briefText, communicationStyles }: KnowledgeEditorProps) {
    const [activeTab, setActiveTab] = useState<Tab>("brief");
    const [brief, setBrief] = useState(briefText || "");
    const [styles, setStyles] = useState(communicationStyles || "");
    const [isPending, startTransition] = useTransition();
    const [saved, setSaved] = useState(false);

    const tabs: { id: Tab; label: string; icon: typeof FileText }[] = [
        { id: "brief", label: "Бриф", icon: FileText },
        { id: "styles", label: "Стили общения", icon: MessageSquareText },
    ];

    const handleSave = () => {
        startTransition(async () => {
            try {
                if (activeTab === "brief") {
                    await updateBriefText(brief);
                } else {
                    await updateCommunicationStyles(styles);
                }
                setSaved(true);
                toast.success("Сохранено!");
                setTimeout(() => setSaved(false), 2000);
            } catch {
                toast.error("Ошибка сохранения");
            }
        });
    };

    const currentValue = activeTab === "brief" ? brief : styles;
    const currentSetter = activeTab === "brief" ? setBrief : setStyles;
    const placeholder = activeTab === "brief"
        ? "Здесь будет ваш бриф после генерации. Вы также можете написать или отредактировать его вручную..."
        : "Опишите стили общения для вашего бренда. Например: официальный, дружелюбный, экспертный, с юмором...";

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col">
            {/* Header */}
            <div className="border-b border-border px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-foreground">База знаний</h1>
                            <p className="text-sm text-muted-foreground">Бриф и стили — основа для генерации контента</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        className={cn(
                            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all cursor-pointer",
                            saved
                                ? "bg-green-500/10 text-green-400 border border-green-500/30"
                                : "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary-hover hover:scale-105",
                            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        )}
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : saved ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {saved ? "Сохранено" : "Сохранить"}
                    </button>
                </div>

                {/* Tabs */}
                <div className="mt-4 flex gap-1 rounded-lg bg-surface p-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                                    activeTab === tab.id
                                        ? "bg-card text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden p-6">
                <div className="h-full rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-all focus-within:border-primary/30">
                    <textarea
                        value={currentValue}
                        onChange={(e) => currentSetter(e.target.value)}
                        placeholder={placeholder}
                        className="h-full w-full resize-none rounded-2xl bg-transparent p-6 text-sm leading-relaxed text-foreground placeholder-muted outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
