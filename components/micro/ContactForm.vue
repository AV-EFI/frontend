<template>
  <form @submit.prevent="sendMail">
    <!-- Fields copied exactly -->
    <div class="form-control mb-4">
      <label
        class="label"
        for="email-input"
      >
        <span class="label-text">E-Mail</span>
      </label>
      <input
        id="email-input"
        v-model="email"
        type="email"
        :placeholder="$t('enterYourEmail')"
        class="input input-bordered w-full"
        required
        aria-describedby="email-desc"
      >
      <small
        id="email-desc"
        class="sr-only"
      >{{ $t('emailHelpText') }}</small>
    </div>

    <div class="form-control mb-4">
      <label
        class="label"
        for="message-input"
      >
        <span class="label-text">{{ $t('message') }}</span>
      </label>
      <textarea
        id="message-input"
        v-model="message"
        :placeholder="$t('enterYourMessage')"
        class="textarea textarea-bordered w-full"
        required
        aria-describedby="message-desc"
      />
      <small
        id="message-desc"
        class="sr-only"
      >{{ $t('messageHelpText') }}</small>
    </div>

    <div class="form-control mb-4">
      <label
        class="label"
        for="captcha-input"
      >
        <span class="label-text">{{ $t('captchaText', { name: captchaQuestion }) }}</span>
      </label>
      <input
        id="captcha-input"
        v-model="captchaAnswer"
        type="text"
        :placeholder="$t('enterYourAnswer')"
        class="input input-bordered w-full"
        required
        aria-describedby="captcha-desc"
      >
      <small
        id="captcha-desc"
        class="sr-only"
      >{{ $t('captchaHelpText') }}</small>
    </div>

    <button
      type="submit"
      class="btn btn-secondary w-full"
    >
      {{ $t('send') }}
    </button>
  </form>
</template>