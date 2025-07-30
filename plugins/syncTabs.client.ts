export default defineNuxtPlugin(() => {
    const shoppingCartStore = useShoppingCart();
    const cartKey = 'pinia-shoppingCart'; // adjust if you use a custom key
    const localCartUpdateKey = 'shoppingCart-local-update';
    const tabId = `${Date.now()}-${Math.random()}`;

    if (import.meta.client) {
    // Mark updates from this tab
        shoppingCartStore.$subscribe((_mutation, state) => {
            localStorage.setItem(cartKey, JSON.stringify(state));
            localStorage.setItem(localCartUpdateKey, tabId);
        });

        // Listen to updates from other tabs
        window.addEventListener('storage', (event) => {
            if (event.key === cartKey) {
                const lastWriter = localStorage.getItem(localCartUpdateKey);
                if (lastWriter === tabId) return;

                try {
                    const newState = JSON.parse(event.newValue || '{}');
                    shoppingCartStore.$patch({ ...newState });
                } catch (e) {
                    console.error('Failed to sync shopping cart across tabs:', e);
                }
            }
        });
    }
});
