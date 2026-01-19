// server/api/cms/glossary.get.ts
import { useServerVocab } from '~/server/utils/useServerVocab';

export default defineEventHandler(async () => {
    return await useServerVocab();
});
