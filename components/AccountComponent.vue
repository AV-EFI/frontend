<script setup>
const supabase = useSupabaseClient();

const loading = ref(true);
const username = ref('');
const website = ref('');
const avatarPath = ref('');

loading.value = true;
const user = useSupabaseUser();

const { data } = await supabase
    .from('profiles')
    .select(`username, website, avatarUrl`)
    .eq('id', user.value.id)
    .single();

if (data) {
    username.value = data.username;
    website.value = data.website;
    avatarPath.value = data.avatarUrl;
}

loading.value = false;

async function updateProfile() {
    try {
        loading.value = true;
        const user = useSupabaseUser();

        const updates = {
            id: user.value.id,
            username: username.value,
            website: website.value,
            avatarUrl: avatarPath.value,
            updatedAt: new Date(),
        };

        const { error } = await supabase.from('profiles').upsert(updates, {
            returning: 'minimal', // Don't return the value after inserting
        });

        if (error) throw error;
    } catch (error) {
        alert(error.message);
    } finally {
        loading.value = false;
    }
}

async function signOut() {
    try {
        loading.value = true;
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    } catch (error) {
        alert(error.message);
    } finally {
        loading.value = false;
    }
}
</script>

<template>
  <form
    class="form-widget"
    @submit.prevent="updateProfile"
  >
    <Avatar
      v-model:path="avatarPath"
      @upload="updateProfile"
    />
    <div>
      <label for="email">Email</label>
      <input
        id="email"
        type="text"
        :value="user.email"
        disabled
      >
    </div>
    <div>
      <label for="username">Name</label>
      <input
        id="username"
        v-model="username"
        type="text"
      >
    </div>
    <div>
      <label for="website">Website</label>
      <input
        id="website"
        v-model="website"
        type="url"
      >
    </div>

    <div>
      <input
        type="submit"
        title="Absenden"
        class="button primary block"
        :value="loading ? 'Loading ...' : 'Update'"
        :disabled="loading"
      >
    </div>

    <div>
      <button
        class="button block"
        :disabled="loading"
        @click="signOut"
      >
        Sign Out
      </button>
    </div>
  </form>
</template>