"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { createContentPlan, generateContentPlanPosts } from "@/actions/content-plan";
import { ContentPlanToolbar } from "@/components/content-plan/content-plan-toolbar";
import { RubricTags } from "@/components/content-plan/rubric-tags";
import { ChatInput } from "@/components/content-plan/chat-input";
import type { SocialNetwork, RubricData, AIProvider as AIProviderType, PlanDuration } from "@/types";

interface ContentPlanFormProps {
    socialNetworks: SocialNetwork[];
    rubrics: RubricData[];
}

export function ContentPlanForm({ socialNetworks, rubrics }: ContentPlanFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [selectedNetworks, setSelectedNetworks] = useState<number[]>([]);
    const [selectedRubrics, setSelectedRubrics] = useState<string[]>(
        rubrics.filter((r) => r.isActive).map((r) => r.id)
    );
    const [postsPerWeek, setPostsPerWeek] = useState(5);
    const [publishDays, setPublishDays] = useState<number[]>([1, 2, 4, 5, 6]);
    const [startDate, setStartDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [duration, setDuration] = useState<PlanDuration>("1month");
    const [wishes, setWishes] = useState("");
    const [aiProvider, setAIProvider] = useState<AIProviderType>("openai");
    const [aiModel, setAIModel] = useState("gpt-5.2");

    const handleSubmit = async () => {
        if (selectedNetworks.length === 0) {
            toast.error("Выберите хотя бы одну соцсеть");
            return;
        }
        if (selectedRubrics.length === 0) {
            toast.error("Выберите хотя бы одну рубрику");
            return;
        }
        if (publishDays.length !== postsPerWeek) {
            toast.error(`Выберите ровно ${postsPerWeek} дней для публикации`);
            return;
        }

        startTransition(async () => {
            try {
                const plan = await createContentPlan({
                    socialNetworkIds: selectedNetworks,
                    rubricIds: selectedRubrics,
                    postsPerWeek,
                    publishDays,
                    startDate: new Date(startDate),
                    wishes,
                    aiProvider,
                    aiModel,
                });

                toast.success("Контент-план создан! Генерация постов...");

                const result = await generateContentPlanPosts(plan.id);
                toast.success(`Создано ${result.postsCount} постов!`);

                router.push("/calendar");
                router.refresh();
            } catch {
                toast.error("Ошибка при создании контент-плана");
            }
        });
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col">
            {/* Empty state / hero area */}
            <div className="flex flex-1 flex-col items-center justify-center px-4">
                {isPending ? (
                    <div className="flex flex-col items-center gap-4 animate-fade-in">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Sparkles className="h-8 w-8 text-primary animate-glow-pulse" />
                            </div>
                            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl animate-glow-pulse" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-medium text-foreground">Генерируем контент-план...</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                AI анализирует параметры и создаёт посты
                            </p>
                        </div>
                        <div className="flex gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                            <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                            <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 opacity-40">
                        <div className="h-20 w-20 rounded-2xl bg-surface flex items-center justify-center">
                            <Sparkles className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div className="text-center max-w-md">
                            <p className="text-base font-medium text-muted-foreground">
                                Настройте параметры и опишите тему
                            </p>
                            <p className="mt-1 text-sm text-muted">
                                Выберите соцсети, рубрики, частоту и AI модель в панели ниже
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom control area */}
            <div className="mx-auto w-full max-w-3xl space-y-3 pb-4">
                {/* Rubric tags */}
                <RubricTags
                    rubrics={rubrics}
                    selected={selectedRubrics}
                    onChange={setSelectedRubrics}
                />

                {/* Toolbar */}
                <ContentPlanToolbar
                    networks={socialNetworks}
                    selectedNetworks={selectedNetworks}
                    onNetworksChange={setSelectedNetworks}
                    startDate={startDate}
                    onStartDateChange={setStartDate}
                    duration={duration}
                    onDurationChange={setDuration}
                    postsPerWeek={postsPerWeek}
                    publishDays={publishDays}
                    onPostsPerWeekChange={setPostsPerWeek}
                    onPublishDaysChange={setPublishDays}
                    aiProvider={aiProvider}
                    aiModel={aiModel}
                    onProviderChange={setAIProvider}
                    onModelChange={setAIModel}
                />

                {/* Chat input */}
                <ChatInput
                    value={wishes}
                    onChange={setWishes}
                    onSubmit={handleSubmit}
                    isPending={isPending}
                />
            </div>
        </div>
    );
}
