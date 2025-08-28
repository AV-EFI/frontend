/* eslint-disable */
import { readUserGlossary } from '../../utils/userGlossaryStore';

type Row = { path: string; de: string; en: string };

export default defineEventHandler(async () => {
  const store = await readUserGlossary();
  const entries: Row[] = Object.keys(store.entries)
    .sort((a, b) => a.localeCompare(b))
    .map((path) => ({
      path,
      de: store.entries[path]?.de ?? '',
      en: store.entries[path]?.en ?? '',
      showDetail: store.entries[path]?.showDetail ?? false,
        showSearch: store.entries[path]?.showSearch ?? false,
    }));
  return { entries, updatedAt: store.updatedAt };
});
