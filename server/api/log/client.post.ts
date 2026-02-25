import { defineEventHandler, readBody, getRequestHeader } from 'h3';
import { z } from 'zod';
import { useNitroApp } from '#imports';

const PayloadSchema = z.object({
    type: z.string().optional(),
    message: z.string().min(1).max(2000),
    stack: z.string().max(20000).optional(),
    info: z.string().optional(),
    source: z.string().optional(),
    url: z.string().optional(),
    userAgent: z.string().optional(),
    timestamp: z.string().optional(),
    line: z.number().optional(),
    column: z.number().optional(),
});

export default defineEventHandler(async (event) => {
    const body = await readBody(event).catch(() => null);
    const parsed = PayloadSchema.safeParse(body);

    if (!parsed.success) {
        event.node.res.statusCode = 400;
        return { success: false, error: 'Invalid payload' };
    }

    const payload = parsed.data;
    const ip =
        getRequestHeader(event, 'x-forwarded-for') ||
        event.node.req.socket.remoteAddress ||
        'unknown';

    const entry = { ...payload, ip };

    try {
        const nitro = useNitroApp();
        nitro.logger.error(entry, `Client JS error: ${payload.message}`);
    } catch (err) {
        console.error('Client JS error:', entry);
    }

    return { success: true };
});
