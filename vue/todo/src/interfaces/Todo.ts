export interface Todo {
    id: string;
    task: string;
    user_id: string;
    is_done: boolean;
    is_archived: boolean;
    updated_at: string;
    created_at: string;
}