<!-- components/MicroContactForm.vue -->
<template>
    <form class="space-y-4 text-left relative" novalidate @submit.prevent="handleSubmit">
        <!-- Email -->
        <div>
            <label for="email" class="block text-left text-sm font-medium mt-2 text-base-content">
                {{ $t('email') }}
            </label>
            <input id="email" v-model="email" type="email" class="input input-bordered w-full mt-1" required
                   autocomplete="email" aria-describedby="emailHelp">
            <p id="emailHelp" class="text-xs text-base-content/70">
                {{ $t('emailHelpText') }}
            </p>
        </div>

        <!-- Message -->
        <div>
            <label for="message" class="block text-left text-sm font-medium text-base-content">
                {{ $t('enterYourMessage') }}
            </label>
            <textarea id="message" v-model="message" class="textarea textarea-bordered w-full mt-1" required
                      aria-describedby="messageHelpText" rows="5" />
            <p id="messageHelpText" class="text-xs text-base-content/70">
                {{ $t('messageHelpText') }}
            </p>
        </div>

        <!-- Simple math Captcha -->
        <div>
            <label for="captcha" class="block text-left text-sm font-medium text-base-content">
                {{ $t('captchaQuestion') }}: <span class="font-bold">{{ captchaQuestion }}</span>
            </label>
            <input id="captcha" v-model="captchaAnswer" type="text" class="input input-bordered w-full mt-1" required
                   inputmode="numeric" aria-describedby="captchaHelpText">
            <p id="captchaHelpText" class="text-xs text-base-content/70">
                {{ $t('captchaHelpText') }}
            </p>
        </div>

        <!-- Honeypot (should stay empty) -->
        <input v-model="hp" type="text" class="hidden" aria-hidden="true" tabindex="-1" autocomplete="off">

        <!-- Submit -->
        <button type="submit" class="btn btn-primary w-full" :disabled="sending">
            {{ sending ? $t('sending') : $t('send') }}
        </button>

        <!-- Live region for feedback -->
        <p class="sr-only" aria-live="polite">
            {{ liveMsg }}
        </p>
    </form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
const emit = defineEmits<{
    (e: 'ContactFormClose'): void
}>();

function emitClose() {
    emit('ContactFormClose');
}

const nuxtApp = useNuxtApp();
const {$toast} = nuxtApp;
const $t = (key: string) => {
    const i18n = nuxtApp.$i18n as { t?: (key: string) => string } | undefined;
    return i18n?.t?.(key) ?? key;
};

const props = defineProps<{ initialMessage?: string; initialEmail?: string }>();

const email = ref(props.initialEmail || '');
const message = ref(props.initialMessage || '');
const captchaQuestion = ref('');
const captchaAnswer = ref('');
const captchaSolution = ref(0);
const sending = ref(false);
const hp = ref('');           // honeypot
const liveMsg = ref('');

onMounted(() => generateCaptcha());

// Keep message/email in sync if parent updates the initial props
watch(() => props.initialMessage, (v) => {
    if (v !== undefined) message.value = v || '';
});
watch(() => props.initialEmail, (v) => {
    if (v !== undefined) email.value = v || '';
});

function generateCaptcha() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    captchaQuestion.value = `${a} + ${b}`;
    captchaSolution.value = a + b;
}

function validateCaptcha() {
    return parseInt(captchaAnswer.value, 10) === captchaSolution.value;
}

async function handleSubmit() {
    if (hp.value) {
        liveMsg.value = $t('spamDetected');
        return;
    }
    if (!validateCaptcha()) {
        liveMsg.value = $t('captchaIncorrect');
        $toast?.error?.($t('captchaIncorrect'));
        generateCaptcha();
        captchaAnswer.value = '';
        return;
    }

    sending.value = true;
    liveMsg.value = '';

    try {
        const res = await $fetch('/api/mail/contact', {
            method: 'POST',
            body: { email: email.value, message: message.value }
        });

        if ((res as any)?.success) {
            liveMsg.value = $t('messageSentSuccess');
            $toast?.success?.($t('messageSentSuccess'));
            email.value = '';
            message.value = '';
            captchaAnswer.value = '';
            generateCaptcha();
        } else {      
            throw new Error((res as any)?.error || 'Failed to send message');
        }
    } catch (err) {
        console.error(err);
        liveMsg.value = $t('messageSentError');
        $toast?.error?.($t('messageSentError'));
    } finally {
        sending.value = false;
    }
}
</script>
