export interface TerminalContext {
    create(name: string, initialCommand?: string): Promise<string | null>
}

export interface Terminal {
    name: string
    id: string
    initialCommand?: string
}