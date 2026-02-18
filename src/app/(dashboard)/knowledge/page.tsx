import { getOrCreateKnowledgeBase } from "@/actions/knowledge";
import { KnowledgeEditor } from "@/components/knowledge/knowledge-editor";

export default async function KnowledgePage() {
    const kb = await getOrCreateKnowledgeBase();

    return (
        <KnowledgeEditor
            briefText={kb.briefText}
            communicationStyles={kb.communicationStyles}
        />
    );
}
