<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <!-- Email -->
    <div>
      <label for="email" class="block text-sm font-medium">
        {{ $t('email') }}
      </label>
      <input
        id="email"
        v-model="email"
        type="email"
        class="input input-bordered w-full mt-1"
        required
        aria-describedby="emailHelp"
      >
      <p id="emailHelp" class="text-xs text-gray-500">
        {{ $t('emailHelpText') }}
      </p>
    </div>

    <!-- Message -->
    <div>
      <label for="message" class="block text-sm font-medium">
        {{ $t('message') }}
      </label>
      <textarea
        id="message"
        v-model="message"
        class="textarea textarea-bordered w-full mt-1"
        required
        aria-describedby="messageHelpText"
      />
      <p id="messageHelpText" class="text-xs text-gray-500">
        {{ $t('messageHelpText') }}
      </p>
    </div>

    <!-- Captcha -->
    <div>
      <label for="captcha" class="block text-sm font-medium">
        {{ $t('captchaQuestion') }}: <span class="font-bold">{{ captchaQuestion }}</span>
      </label>
      <input
        id="captcha"
        v-model="captchaAnswer"
        type="text"
        class="input input-bordered w-full mt-1"
        required
        aria-describedby="captchaHelpText"
      >
      <p id="captchaHelpText" class="text-xs text-gray-500">
        {{ $t('captchaHelpText') }}
      </p>
    </div>

    <!-- Submit -->
    <button type="submit" class="btn btn-primary w-full" :disabled="sending">
      {{ sending ? $t('sending') : $t('send') }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const email = ref('');
const message = ref('');
const captchaQuestion = ref('');
const captchaAnswer = ref('');
const captchaSolution = ref(0);
const sending = ref(false);

const { send } = useMail();

onMounted(() => {
    generateCaptcha();
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
    if (!validateCaptcha()) {
        alert('Captcha answer is incorrect');
        generateCaptcha();
        captchaAnswer.value = '';
        return;
    }

    sending.value = true;
    try {
        await send({
            from: email.value,
            subject: `Contact Form Submission`,
            text: message.value,
        });
        alert('Message sent successfully!');
        email.value = '';
        message.value = '';
        captchaAnswer.value = '';
        generateCaptcha();
    } catch (err) {
        console.error(err);
        alert('Failed to send message.');
    } finally {
        sending.value = false;
    }
}
</script>
