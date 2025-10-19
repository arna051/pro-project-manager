'use client';

import { SETTINGS } from "@next/constants/settings";
import SSHConfig from "@next/views/servers/config";
import { useEffect, useState } from "react";


export default function Page() {

    const [apiKey, setApiKey] = useState<string>();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const data = await window.electron.db.doc("Setting", [
                {
                    $match: { key: SETTINGS.deepseek }
                }
            ]);
            setApiKey(data.value)
            setLoading(false)
        })()
    }, [])

    if (loading) return null;

    return <SSHConfig apiKey={apiKey} />
}
