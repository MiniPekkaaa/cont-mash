"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function getOrCreateKnowledgeBase() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    let kb = await db.knowledgeBase.findUnique({
        where: { userId: session.user.id },
    });

    if (!kb) {
        kb = await db.knowledgeBase.create({
            data: { userId: session.user.id },
        });
    }

    return kb;
}

export async function updateBriefText(briefText: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    return db.knowledgeBase.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id, briefText },
        update: { briefText },
    });
}

export async function updateCommunicationStyles(communicationStyles: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    return db.knowledgeBase.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id, communicationStyles },
        update: { communicationStyles },
    });
}
