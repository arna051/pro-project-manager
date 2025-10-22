'use client';

import { IServer } from "@electron/model/server";
import { SETTINGS } from "@next/constants/settings";
import SSHConfig from "@next/views/servers/config";
import { useEffect, useState } from "react";



export default function Page() {

  const [apiKey, setApiKey] = useState<string>();

  const [servers, setServers] = useState<IServer[]>([])

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await window.electron.db.doc("Setting", [
        {
          $match: { key: SETTINGS.deepseek }
        }
      ]);
      setApiKey(data.value)


      const s = await window
        .electron
        .db
        .find<IServer>("Server");

      setServers(s)

      setLoading(false)
    })()
  }, [])

  if (loading) return null;
  return <SSHConfig apiKey={apiKey} servers={servers} dashboard />
}
