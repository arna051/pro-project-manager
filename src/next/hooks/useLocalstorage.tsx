"use client";
import { useEffect, useState } from "react"

type Transformer<T> = (val: string) => T

type Props<T> = {
    key: string
    default: T
    type: Transformer<T>
    stringify?: (val: T) => string
}

export default function useLocalStorage<T>(props: Props<T>) {
    const { key, default: defaultValue, type, stringify } = props

    const [state, setState] = useState<T>(defaultValue)

    useEffect(() => {
        // only runs on client
        const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null
        if (raw !== null) {
            setState(type(raw))
        }
    }, [key, type])

    useEffect(() => {
        localStorage.setItem(key, stringify ? stringify(state) : String(state))
    }, [state, key, stringify])

    return [state, setState] as const
}
