import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import { z } from 'zod';

interface ChatChip {
    id: string;
    type: string;
    label: string;
}

const bodySchema = z.object({
    message: z.string().trim().min(1, 'Message cannot be empty'),
    context: z.object({
        chips: z.array(z.object({
            id: z.string().trim().min(1),
            type: z.string().trim().min(1),
            label: z.string().trim().min(1),
        })).max(20).default([]),
    }).default({ chips: [] }),
});

export default defineEventHandler(async (event) => {
    const requestId = crypto.randomUUID();
    const startedAt = performance.now();

    try {
        const rawBody = await readBody(event);
        const parsed = bodySchema.safeParse(rawBody);

        if (!parsed.success) {
            console.warn('[poc/chat] invalid payload', { requestId, issues: parsed.error.issues });
            setResponseStatus(event, 400);
            return {
                answer: 'Ich konnte Ihre Anfrage nicht verarbeiten. Bitte prüfen Sie die Eingaben.',
                sources: [],
            };
        }

        const { message, context } = parsed.data;
        const chips = context.chips ?? [];

        const chipSummary = chips.length
            ? `Kontext: ${chips.map((chip) => `${chip.label} (${chip.type})`).join(', ')}.`
            : 'Kein zusätzlicher Kontext übermittelt.';

        const answer = `Stub-Antwort: ${message}. ${chipSummary}`;

        console.info('[poc/chat]', {
            requestId,
            chipCount: chips.length,
            tookMs: Math.round(performance.now() - startedAt),
        });

        const sources = chips.slice(0, 5).map((chip) => ({ id: chip.id, label: chip.label }));

        return {
            answer,
            sources,
        };
    } catch (error) {
        console.error('[poc/chat] error', { requestId, error });
        setResponseStatus(event, 500);
        return {
            answer: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
            sources: [],
        };
    }
});
