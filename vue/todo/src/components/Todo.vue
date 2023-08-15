<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Todo } from '../interfaces/Todo';

const inputRef = ref<HTMLInputElement | null>(null)
const task = ref<string>('')
const rows = ref<number>(1)

const props = defineProps<{
    todo: Todo
}>()
const emit = defineEmits(['toggleDone', 'editTodo'])

onMounted(() => {
    task.value = props.todo.task;
    rows.value = (props.todo?.task.length || 41) > 45 ? 2 : 1
})

function scrollUp() {
    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}

const toggleTodo = (payload: Event) => emit('toggleDone', { id: props.todo.id, isDone: props.todo.is_done })

const editTodo = (payload: KeyboardEvent) => {
    emit('editTodo', { id: props.todo.id, task: task.value });
    inputRef?.value?.blur()
    scrollUp()
}
</script>

<template>
    <li class="flex items-center mb-4">
        <textarea ref="inputRef" wrap="soft" :rows="rows" :disabled="todo.is_archived" v-model="task"
            @keydown.enter="editTodo" @keyup.enter="editTodo"
            class="w-full border-none bg-transparent text-gray-300 mb-0 focus:outline-none focus:ring-0 focus:underline underline-offset-2 decoration-teal-500"></textarea>
        <input type="checkbox" @change="toggleTodo" :checked="todo?.is_done || todo?.is_archived"
            :disabled="todo?.is_archived"
            class="w-4 bg-black rounded-sm pb-0 mb-0 hover:border-teal-500 focus:border-teal-500 focus:outline-none focus:ring-0 checked:bg-teal-500 focus-visible:border-gray-300 text-teal-500 outline-none cursor-pointer ring-0">
    </li>
</template>