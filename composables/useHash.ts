import { title } from 'process';
import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useHash(scroll = true) {
    const hash = ref('');

    onMounted(() => {
        const updateHash = () => {
            hash.value = window.location.hash.slice(1);

            if (scroll && hash.value) {
                setTimeout(() => {
                    const el = document.getElementById(hash.value);
                    if (el) {
                        // Open the closest collapse section
                        const collapseElement = el.closest('.collapse');
                        const parentToggle = collapseElement?.querySelector('.manifestation-accordion-toggle') as HTMLInputElement | null;

                        if (parentToggle) {
                            parentToggle.checked = true;
                        }

                        setTimeout(() => {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

                            el.classList.add('hash-highlight-conic');
                            setTimeout(() => {
                                el.classList.remove('hash-highlight-conic');
                                const label = el.querySelector('label');
                                if (label) {
                                    label.appendChild(
                                        Object.assign(document.createElement('span'), {
                                            className: 'badge badge-accent bg-highlight border-highlight badge-xs',
                                            title: 'Referenzierter efi'
                                        })
                                    );
                                }
                            }, 4200);
                            
                        }, 600);
                    }
                }, 1400); // allow DOM/render to settle
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
