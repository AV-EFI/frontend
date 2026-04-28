/**
 * useLiveToast
 *
 * Provides a shared `aria-live` region state and an `announce()` helper that
 * resets and re-sets the message so screen readers pick up every update.
 *
 * The live region itself must be rendered once in app.vue:
 *
 *   <div id="live-toast-region" class="sr-only" aria-live="assertive" aria-atomic="true">
 *     {{ liveMessage }}
 *   </div>
 *
 * Every call to $toast (or useUndoToast) should also call announce() so that
 * users who cannot see the visual toast still receive the feedback.
 */
export function useLiveToast() {
    // Nuxt useState keeps this in sync across all useLiveToast() call-sites.
    const liveMessage = useState<string>('live-toast-msg', () => '')

    /**
     * Write `msg` to the live region.
     * The empty→text cycle forces screen readers to re-announce even when the
     * message is identical to the previous one.
     */
    const announce = (msg: string) => {
        if (typeof window === 'undefined') return
        liveMessage.value = ''
        nextTick(() => {
            liveMessage.value = msg
        })
    }

    return { liveMessage, announce }
}
