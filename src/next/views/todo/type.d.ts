
export type Todo = {
    projectId: string
    projectTitle: string
    task: string;
    date: number;
    priority: number;
    done: boolean
}

export type Data = {
    date: number,
    data: Todo[]
}