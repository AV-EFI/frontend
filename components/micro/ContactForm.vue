<!-- components/MicroContactForm.vue -->
<template>
  <form
    class="space-y-4"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <!-- Email -->
    <div>
      <label
        for="email"
        class="block text-sm font-medium"
      >
        {{ $t('email') }}
      </label>
      <input
        id="email"
        v-model="email"
        type="email"
        class="input input-bordered w-full mt-1"
        required
        autocomplete="email"
        aria-describedby="emailHelp"
      >
      <p
        id="emailHelp"
        class="text-xs text-gray-500"
      >
        {{ $t('emailHelpText') }}
      </p>
    </div>

    <!-- Message -->
    <div>
      <label
        for="message"
        class="block text-sm font-medium"
      >
        {{ $t('message') }}
      </label>
      <textarea
        id="message"
        v-model="message"
        class="textarea textarea-bordered w-full mt-1"
        required
        aria-describedby="messageHelpText"
        rows="5"
      />
      <p
        id="messageHelpText"
        class="text-xs text-gray-500"
      >
        {{ $t('messageHelpText') }}
      </p>
    </div>

    <!-- Simple math Captcha -->
    <div>
      <label
        for="captcha"
        class="block text-sm font-medium"
      >
        {{ $t('captchaQuestion') }}: <span class="font-bold">{{ captchaQuestion }}</span>
      </label>
      <input
        id="captcha"
        v-model="captchaAnswer"
        type="text"
        class="input input-bordered w-full mt-1"
        required
        inputmode="numeric"
        aria-describedby="captchaHelpText"
      >
      <p
        id="captchaHelpText"
        class="text-xs text-gray-500"
      >
        {{ $t('captchaHelpText') }}
      </p>
    </div>

    <!-- Honeypot (should stay empty) -->
    <input
      v-model="hp"
      type="text"
      class="hidden"
      aria-hidden="true"
      tabindex="-1"
      autocomplete="off"
    >

    <!-- Submit -->
    <button
      type="submit"
      class="btn btn-primary w-full"
      :disabled="sending"
    >
      {{ sending ? $t('sending') : $t('send') }}
    </button>

    <!-- Live region for feedback -->
    <p
      class="sr-only"
      aria-live="polite"
    >
      {{ liveMsg }}
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { toast } from 'vue3-toastify';

const email = ref('');
const message = ref('');
const captchaQuestion = ref('');
const captchaAnswer = ref('');
const captchaSolution = ref(0);
const sending = ref(false);
const hp = ref('');           // honeypot
const liveMsg = ref('');

onMounted(() => generateCaptcha());

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
        liveMsg.value = 'Spam detected.';
        return;
    }
    if (!validateCaptcha()) {
        liveMsg.value = 'Captcha answer is incorrect';
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
            liveMsg.value = 'Message sent successfully!';
            toast.success($t('messageSentSuccess'));
            email.value = '';
            message.value = '';
            captchaAnswer.value = '';
            generateCaptcha();
        } else {      
            toast.error($t('messageSentError'));
            throw new Error((res as any)?.error || 'Failed to send message');
        }
    } catch (err) {
        console.error(err);
        liveMsg.value = 'Failed to send message.';
        toast.error($t('messageSentError'));
    } finally {
        sending.value = false;
    }
}
</script>
