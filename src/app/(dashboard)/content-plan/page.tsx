import { getRubrics } from "@/actions/rubrics";
import { getSocialNetworks } from "@/actions/content-plan";
import { ContentPlanForm } from "@/components/content-plan/content-plan-form";

export default async function ContentPlanPage() {
    const [socialNetworks, rubrics] = await Promise.all([
        getSocialNetworks(),
        getRubrics(),
    ]);

    return (
        <ContentPlanForm
            socialNetworks={socialNetworks}
            rubrics={rubrics.map((r) => ({
                id: r.id,
                name: r.name,
                description: r.description,
                postsPerMonth: r.postsPerMonth,
                sortOrder: r.sortOrder,
                isActive: r.isActive,
            }))}
        />
    );
}
