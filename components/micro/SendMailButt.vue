<template>
  <div class="dropdown dropdown-bottom dropdown-end">
    <div
      tabindex="0"
      role="button"
      class="btn btn-sm btn-primary btn-outline w-full" 
      :title="showForm ? 'Close form' : 'Open form'"
      :aria-label="showForm ? 'Close form' : 'Open form'"
      :aria-expanded="showForm.toString()"
      @click="toggleForm"
    >
      <LazyIcon
        name="fa:paper-plane"
      />
    </div>
    <div
      v-if="showForm"
      class="mt-4 p-4 border rounded-lg shadow-lg bg-base-100 w-96 dropdown-content menu"
    >
      <form @submit.prevent="sendMail">
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Your Email</span>
          </label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="Enter your email" 
            class="input input-bordered w-full" 
            required 
          >
        </div>
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Message</span>
          </label>
          <textarea 
            v-model="message" 
            placeholder="Enter your message" 
            class="textarea textarea-bordered w-full" 
            required
          />
        </div>
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">What is {{ captchaQuestion }}?</span>
          </label>
          <input 
            v-model="captchaAnswer" 
            type="text" 
            placeholder="Enter your answer" 
            class="input input-bordered w-full" 
            required 
          >
        </div>
        <button 
          type="submit" 
          class="btn btn-secondary w-full"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {toast} from 'vue3-toastify';
const mail = useMail();
console.log('mail', mail);

const showForm = ref(false);
const email = ref('');
const message = ref('');
const captchaQuestion = ref('');
const captchaAnswer= ref('');
const captchaCorrectAnswer = ref('');

const toggleForm = () => {
    showForm.value = !showForm.value;
    if (showForm) {
        generateCaptcha();
    }
};

const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    captchaQuestion.value = `${num1} + ${num2}`;
    captchaCorrectAnswer.value = (num1 + num2).toString();
    console.log('Captcha:', captchaQuestion.value, 'Answer:', captchaCorrectAnswer.value);
};

const sendMail = () => {
    if (captchaAnswer.value !== captchaCorrectAnswer.value) {
        alert('Captcha is incorrect. Please try again.');
        captchaAnswer.value = '';
        generateCaptcha();
        return;
    }
    // Handle sending mail logic here
    console.log('Email:', email.value);
    console.log('Message:', message.value);

    mail.send({
        from: email.value, 
        text: 'Von: \n'+email.value + '\n\n Nachricht:\n' + message.value + `\nURL: ${window.location.href}`,
        subject: 'AVefi Kontaktformular',
    }).then(() => {
        toast.success('Mail sent successfully!');
    }).catch((error: unknown) => {
        const err = error as Error;
        console.error('Error sending mail:', err.message);
        toast.error('Error sending mail. Please try again later.');
    });

    email.value = '';
    message.value = '';
    captchaAnswer.value = '';
    showForm.value = false;
};
</script>
