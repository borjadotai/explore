<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '../supabase'
import Avatar from '@/components/Avatar.vue'
import type { AuthSession } from '@supabase/supabase-js';
import { useRouter } from 'vue-router';

const session = JSON.parse(window.localStorage.getItem('sb-tsqfpecssujjoeglqusv-auth-token') || '{}') as AuthSession

const loading = ref(true)
const username = ref('')
const website = ref('')
const avatar_url = ref('')
const router = useRouter()

onMounted(() => {
    getProfile()
})

async function getProfile() {
    try {
        loading.value = true
        const { user } = session

        let { data, error, status } = await supabase
            .from('profiles')
            .select(`username, website, avatar_url`)
            .eq('id', user.id)
            .single()

        if (error && status !== 406) throw error

        if (data) {
            username.value = data.username
            website.value = data.website
            avatar_url.value = data.avatar_url
        }
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}

async function updateProfile() {
    try {
        loading.value = true
        const { user } = session

        const updates = {
            id: user.id,
            username: username.value,
            website: website.value,
            avatar_url: avatar_url.value,
            updated_at: new Date(),
        }

        let { error } = await supabase.from('profiles').upsert(updates)

        if (error) throw error
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}

async function signOut() {
    try {
        loading.value = true
        let { error } = await supabase.auth.signOut()
        if (error) throw error
        router.push('/login')
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <form @submit.prevent="updateProfile">
        <Avatar v-model:path="avatar_url" @upload="updateProfile" size="10" />
        <div>
            <label for="email">Email</label>
            <input class="input disabled" id="email" type="text" :value="session.user.email" disabled />
        </div>
        <div>
            <label for="username">Name</label>
            <input class="input" v-model="username" type="text" />
        </div>
        <div>
            <label for="website">Website</label>
            <input class="input" v-model="website" id="website" type="url" />
        </div>

        <div>
            <button type="submit" class="primary" :disabled="loading">
                {{ loading ? 'Loading ...' : 'Update' }}
            </button>
        </div>

        <div>
            <button class="secondary" @click="signOut" :disabled="loading">Sign Out</button>
        </div>
    </form>
</template>