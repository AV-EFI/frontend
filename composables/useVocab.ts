export async function useGlossary() {
    const { data } = await useFetch('/api/glossary');
    return data.value || [];
}
  