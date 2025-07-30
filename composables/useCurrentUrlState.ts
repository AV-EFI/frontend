import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useCurrentUrlState() {
    const currentUrlState = ref('');

    const updateFromStorage = () => {
        if (typeof localStorage === 'undefined') return;
        const value = localStorage.getItem('latest-search-query') || '';
        if (currentUrlState.value !== value) {
            currentUrlState.value = value;
        }
    };

    const getLatestSearchQuery = (): string => {
        if (typeof localStorage === 'undefined') return '';
        return localStorage.getItem('latest-search-query') || '';
    };

    const handleStorage = (e: StorageEvent) => {
        if (e.key === 'latest-search-query') {
            updateFromStorage();
        }
    };

    onMounted(() => {
        updateFromStorage();
        window.addEventListener('storage', handleStorage);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('storage', handleStorage);
    });

    return {
        currentUrlState
    };
}
