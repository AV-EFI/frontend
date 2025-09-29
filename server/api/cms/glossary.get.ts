export default defineEventHandler(() => {
    const entries = useServerGlossary();
    return entries;
});
  