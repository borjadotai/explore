<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../supabase'

const loading = ref(false)
const sent = ref(false)
const email = ref('')

const handleLogin = async () => {
    try {
        loading.value = true
        const { error } = await supabase.auth.signInWithOtp({
            email: email.value,
        })
        if (error) throw error
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message)
        }
    } finally {
        loading.value = false
        sent.value = true
    }
}
</script>

<template>
    <div class="w-full h-full flex flex-col items-center justify-center" aria-live="polite">
        <h1 class="text-2xl font-semibold">Angular todo</h1>
        <p class="py-6 text-gray-300" v-if="sent">Your one time magic link has been sent!</p>
        <div v-else class="text-center">
            <p class="py-6 text-gray-300">Sign in via magic link with your email below</p>
            <form @submit.prevent="handleLogin">
                <div>
                    <label for="email" class="hidden">Email</label>
                    <input required id="email" v-model="email" type="email" placeholder="Your email"
                        class="input text-center" />
                </div>
                <div>
                    <button type="submit" class="primary" :disabled="loading">
                        {{ loading ? 'Loading...' : 'Send magic link' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>