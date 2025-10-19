export interface TerminalContext {
    create(name: string, initialCommand?: string): Promise<string | null>
    terminals: Terminal[]
    send: (id: string, cmd: string) => any
}

export interface Terminal {
    name: string
    id: string
    initialCommand?: string
}