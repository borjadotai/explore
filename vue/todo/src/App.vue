<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import { supabase } from './supabase'
import Footer from './components/Footer.vue';
import NavbarVue from './components/Navbar.vue';

const session = ref()

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})
</script>

<template>
  <div class="w-full min-h-[100vh] bg-black text-white flex justify-center">
    <div class="min-h-[100vh] pb-24 px-6 pt-6 lg:py-[20%] flex flex-col items-center">
      <div class="w-full">
        <NavbarVue v-if="session" />
      </div>
      <div class="w-full flex-grow">
        <RouterView />
      </div>
      <Footer />
    </div>
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

input.input {
  @apply w-full bg-transparent border border-gray-700 rounded-md py-1 px-2 mb-6;
}

input.input.disabled {
  @apply bg-gray-950;
}

label {
  @apply text-gray-500 uppercase;
}

img {
  @apply rounded-full object-cover mb-4 w-40 h-40;
}

footer a {
  @apply text-teal-600;
}

label {
  @apply text-sm;
}

textarea {
  @apply p-0 h-min resize-none;
}

.primary {
  @apply w-full bg-green-500 border border-gray-800 rounded-md py-1 px-2 mb-2 font-semibold;
}

.secondary {
  @apply w-full bg-transparent border border-gray-800 rounded-md py-1 px-2 mb-6 flex justify-center text-gray-500;
}

.upload {
  @apply w-40 border border-gray-800 rounded-md py-1 px-2 mb-12 flex justify-center text-gray-500 cursor-pointer;
}

.upload:hover {
  @apply bg-gray-800;
}
</style>