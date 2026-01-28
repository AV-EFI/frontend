import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useHash(scroll = true) {
    const hash = ref('');

    onMounted(() => {
        const updateHash = () => {
            hash.value = window.location.hash.slice(1);
            if (scroll && hash.value) {

                setTimeout(() => {
                    const el = document.getElementById(hash.value);
                    console.log('Scrolling to hash element:', hash.value, el);
                    if (el) {
                        // Open the closest collapse section
                        const collapseElement = el.closest('.collapse');
                        const parentToggle = collapseElement?.querySelector('.manifestation-accordion-toggle') as HTMLInputElement | null;

                        if (parentToggle) {
                            parentToggle.checked = true;
                        }

                        setTimeout(() => {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                            el.classList.add('bg-highlight', 'transition', 'duration-600', 'text-white');
                            setTimeout(() => {
                                el.classList.remove('bg-highlight', 'text-white');
                                const label = el.querySelector('label');
                                if (label) {
                                    label.appendChild(
                                        Object.assign(document.createElement('span'), {
                                            className: 'ml-1 badge badge-highlight bg-highlight border-highlight badge-xs',
                                            title: 'Referenzierter efi'
                                        })
                                    );
                                }
                            }, 3200);
                        }, 900);
                    }
                }, 1200);
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
