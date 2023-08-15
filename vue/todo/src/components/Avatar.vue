<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import { supabase } from '../supabase'

const props = defineProps({
    path: { type: String, required: true },
    size: { type: String, required: true }
})
const { path, size } = toRefs(props)

const emit = defineEmits(['upload', 'update:path'])
const uploading = ref(false)
const src = ref('')
const files = ref()

const downloadImage = async () => {
    try {
        const { data, error } = await supabase.storage.from('avatars').download(path.value)
        if (error) throw error
        src.value = URL.createObjectURL(data)
    } catch (error) {
        console.error('Error downloading image: ', error)
    }
}

const uploadAvatar = async (evt: any) => {
    files.value = evt.target.files
    try {
        uploading.value = true
        if (!files.value || files.value.length === 0) {
            throw new Error('You must select an image to upload.')
        }

        const file = files.value[0]
        const fileExt = file.name.split('.').pop()
        const filePath = `${Math.random()}.${fileExt}`

        let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

        if (uploadError) throw uploadError
        emit('update:path', filePath)
        emit('upload')
    } catch (error) {
        console.log(error)
    } finally {
        uploading.value = false
    }
}

watch(path, () => {
    if (path.value) downloadImage()
})
</script>

<template>
    <div class="flex justify-center items-center flex-col">
        <img v-if="src" :src="src" alt="Avatar" class="avatar image" />
        <div v-else class="avatar no-image"></div>
        <div class="upload">
            <label for="single">
                {{ uploading ? 'Uploading ...' : 'Upload picture' }}
            </label>
            <input style="visibility: hidden;position: absolute" type="file" id="single" accept="image/*"
                @change="uploadAvatar" :disabled="uploading" />
        </div>
    </div>
</template>