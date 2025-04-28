// composables/useHash.ts
import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useHash(scroll = true) {
    const hash = ref('');

    onMounted(() => {
        const updateHash = () => {
            hash.value = window.location.hash.slice(1);

            // Optional: Scroll to the element with the ID
            if (scroll && hash.value) {
                setTimeout(() => {
                    const el = document.getElementById(hash.value);
                    console.log(hash.value);
                    if (el) {
                        console.log('Scrolling to element:', el);
                        // Scroll to the element smoothly
                        const collapseElement = el.closest('.collapse');
                        const parent = collapseElement ? collapseElement.querySelector('.manifestation-accordion-toggle') : null;
                        console.log('parent', parent);
                        if(parent)
                        {
                            (parent as HTMLInputElement).checked = true; // Check the parent checkbox
                            console.log(parent);
                        }
                        setTimeout(() => {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            el.classList.add('bg-secondary'); // Add a class for highlighting
                        }, 600);
                        setTimeout(() => {
                            el.classList.remove('bg-secondary'); // Remove the class after a delay
                        }, 3000); // Adjust the delay as needed
                    }
                }, 1000); // Add a small timeout before looking for the element
            }
        };

        updateHash();
        window.addEventListener('hashchange', updateHash);

        onBeforeUnmount(() => {
            window.removeEventListener('hashchange', updateHash);
        });
    });

    return { hash };
}
