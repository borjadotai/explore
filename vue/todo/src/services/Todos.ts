import { supabase } from "@/supabase"

export function fetchTodos() {
    return supabase.from('todos').select().order('created_at', { ascending: true })
}

export function addTodo(userId: string, task: string) {
    return supabase.from('todos').insert({ task, user_id: userId }).select()
}

export function toggleDone(id: string, isDone: boolean) {
    return supabase
        .from('todos')
        .update({ is_done: !isDone })
        .eq('id', id)
        .single()
}

export function archiveTodos(ids: string[]) {
    return Promise.all(ids.map(id => supabase.from('todos').update({ is_archived: true, is_done: false }).eq('id', id)))
}

export function editTodo(id: string, task: string) {
    return supabase
        .from('todos')
        .update({ task })
        .eq('id', id)
        .single()
}