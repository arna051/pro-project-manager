import { createContext, useContext } from "react";
import { TerminalContext } from "./type";

export const terminalContext = createContext<TerminalContext>({} as any)

export function useTerminal() {
    return useContext(terminalContext)
}