/**
 * useUndoToast
 *
 * Shows a toast notification that contains an inline "Undo" button.
 * When the user clicks Undo the toast is dismissed and `onUndo` is called.
 * The message is also written to the aria-live region via useLiveToast so
 * screen-reader users hear the feedback even before the toast container mounts.
 *
 * Usage (inside component setup):
 *
 *   const { show } = useUndoToast()
 *
 *   function removeItem(id: string) {
 *     const snapshot = [...items.value]
 *     items.value = items.value.filter(i => i.id !== id)
 *     show(t('itemRemoved'), () => { items.value = snapshot })
 *   }
 */
import { h } from 'vue'

export function useUndoToast() {
    const { $toast } = useNuxtApp() as any
    const { announce } = useLiveToast()
    const { t } = useI18n()

    /**
     * @param message   Text shown in the toast body.
     * @param onUndo    Callback fired when the user clicks "Undo".
     * @param options   Optional timeout in milliseconds (default 5000).
     */
    function show(
        message: string,
        onUndo: () => void,
        options?: { timeoutMs?: number },
    ) {
        const timeoutMs = options?.timeoutMs ?? 5000
        let undone = false
        let toastId: string | number | undefined

        const renderContent = () =>
            h('div', { class: 'flex items-center gap-3 w-full min-w-0' }, [
                h('span', { class: 'flex-1 text-sm min-w-0 break-words' }, message),
                h(
                    'button',
                    {
                        class: 'btn btn-xs btn-ghost border border-current shrink-0 ml-1',
                        onClick: (e: MouseEvent) => {
                            e.stopPropagation()
                            if (!undone) {
                                undone = true
                                onUndo()
                                if (toastId !== undefined) $toast?.remove?.(toastId)
                                announce(t('actionUndone'))
                            }
                        },
                    },
                    t('undo'),
                ),
            ])

        toastId = $toast?.(renderContent, {
            type: 'info',
            autoClose: timeoutMs,
            // Prevent dismissing by clicking the toast body so the Undo button
            // remains reachable until the user explicitly acts or it times out.
            closeOnClick: false,
        })

        // Mirror to aria-live for screen readers.
        announce(message)

        return {
            /** Programmatically dismiss the toast (e.g. after the action is confirmed). */
            dismiss: () => {
                if (toastId !== undefined) $toast?.remove?.(toastId)
            },
        }
    }

    return { show }
}
