<script setup lang="ts">
import type { Todo } from '@/interfaces/Todo';
import { supabase } from '@/supabase';
import { onMounted, ref } from 'vue';
import * as TodoService from '../services/Todos'
import { default as TodoVue } from '@/components/Todo.vue';
type Filter = 'active' | 'done' | 'archived'

const session = ref()
const loading = ref(false)
const allTodos = ref<Todo[]>([])
const todos = ref<Todo[]>([])
const activeClass = ref('text-white')
const errorText = ref<string | null>(null)
const filter = ref<Filter>('active')
const newItem = ref('')
const newItemRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
    fetchTodos()
    supabase.auth.getSession().then(({ data }) => {
        session.value = data.session
    })
})

async function fetchTodos(): Promise<void> {
    loading.value = true
    let { data: todos, error } = await TodoService.fetchTodos()
    if (error) {
        console.error('error', error.message)
    } else {
        allTodos.value = todos as Todo[] ?? []
        filterTodos(filter.value)
        loading.value = false
    }
}

function filterTodos(filter: Filter) {
    if (filter == 'done') todos.value = allTodos.value.filter(t => t['is_done'])
    if (filter == 'active') todos.value = allTodos.value.filter(t => !t['is_done'] && !t['is_archived'])
    if (filter == 'archived') todos.value = allTodos.value.filter(t => t['is_archived'])
}

function changeFilter(newFilter: Filter) {
    fetchTodos()
    filter.value = newFilter
    filterTodos(newFilter)
}

async function addTodo(task: string): Promise<void> {
    if (task.length <= 3) {
        errorText.value = 'Task length should be more than 3!'
    } else {
        let { data, error } = await TodoService.addTodo(session?.value?.user?.id, task)
        if (error) {
            errorText.value = error.message
        } else {
            todos.value = [...todos.value, data?.[0] as Todo]
            errorText.value = null
        }
    }
}

async function toggleDone({ id, isDone }: { id: string, isDone: boolean }): Promise<void> {
    try {
        await TodoService.toggleDone(id, isDone)
        todos.value = todos.value.map((todo) => {
            if (todo.id === id) {
                return { ...todo, is_done: !isDone }
            }
            return todo
        })
        fetchTodos()
    } catch (error) {
        console.error(error)
    }
}

async function archiveTodos(todo: Todo[]): Promise<void> {
    try {
        await TodoService.archiveTodos(todo.map(todo => todo.id))
        todos.value = todos.value.filter(todo => !todo.is_archived)
        fetchTodos()
    } catch (error) {
        console.error(error)
    }
}

async function editTodo({ id, task }: { id: string, task: string }): Promise<void> {
    try {
        await TodoService.editTodo(id, task as unknown as string)
        todos.value = todos.value.map((todo) => {
            if (todo.id === id) {
                return { ...todo, task }
            }
            return todo
        })
    } catch (error) {
        console.error(error)
    }
}

function scrollUp() {
    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}

const onNewItem = () => {
    addTodo(newItem.value).then(() => newItem.value = '')
    newItemRef?.value?.blur()
    scrollUp()
}
</script>

<template>
    <div class="h-full w-full text-left flex flex-col">
        <div class="flex-grow-0 flex items-baseline">
            <h1 class="text-3xl font-semibold mb-4">Today</h1>
            <div class="ml-4 space-x-4 text-gray-500">
                <button :class="[filter === 'active' ? activeClass : '']" class="bg-transparent border-none"
                    @click="changeFilter('active')">active</button>
                <button :class="[filter === 'done' ? activeClass : '']" class="bg-transparent border-none"
                    @click="changeFilter('done')">done</button>
                <button :class="[filter === 'archived' ? activeClass : '']" class="bg-transparent border-none"
                    @click="changeFilter('archived')">archived</button>
            </div>
        </div>
        <div class="flex-grow">
            <ul class="h-full overflow-y-scroll">
                <div v-if="todos.length">
                    <TodoVue v-for="todo in todos" :todo="todo" @toggleDone="(payload) => toggleDone(payload)"
                        @editTodo="(payload) => editTodo(payload)"></TodoVue>
                </div>
                <button v-if="filter == 'done' && todos.length" (click)="archiveTodos(todos)"
                    class="bg-transparent border-none w-full text-center text-gray-500">archive
                    all</button>
                <div class="w-full h-full flex justify-center items-center">
                    <span v-if="!loading && !todos.length" class="text-gray-400">You don't have any tasks here yet!</span>
                </div>
            </ul>
        </div>
        <input ref="newItemRef" v-model="newItem" placeholder="What are you doing today?"
            class="input outline-none focus:border-teal-500 flex-grow-0" @keyup.enter="onNewItem"
            @keydown.enter="onNewItem" />
    </div>
</template>