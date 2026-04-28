<template>
    <!--
        Inline, accessible form-field error message.
        Pair it with the field via aria-describedby / aria-invalid on the input.

        Usage:
          <input
            id="email"
            :aria-invalid="!!errors.email"
            :aria-describedby="errors.email ? 'email-error' : 'email-help'"
          />
          <MicroInlineFieldError id="email-error" :message="errors.email" />
    -->
    <p
        v-if="message"
        :id="id"
        role="alert"
        class="mt-1 flex items-center gap-1 text-xs text-error"
    >
        <Icon name="tabler:alert-circle" class="h-3 w-3 shrink-0" aria-hidden="true" />
        {{ message }}
    </p>
</template>

<script setup lang="ts">
defineProps<{
    /** Error text. Nothing is rendered when falsy. */
    message?: string | null
    /** id attribute — wire this to the field's aria-describedby */
    id?: string
}>()
</script>
