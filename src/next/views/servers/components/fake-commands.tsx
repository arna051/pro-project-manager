import React from "react";
import { Typewriter } from "react-simple-typewriter";
import { Box, Paper } from "@mui/material";
import { IServer } from "@electron/model/server";

export default function FakeServerTerminal() {
    return (
        <Paper
            elevation={6}
            sx={{
                bgcolor: "black",
                color: "#00ff66",
                fontFamily: "monospace",
                p: 2,
                borderRadius: 2,
                maxWidth: "900px",
                mx: "auto",
                fontSize: 11
            }}
        >
            <Box sx={{ whiteSpace: "pre-wrap" }}>
                <Typewriter
                    words={[`
> ssh admin@192.168.1.50
admin@192.168.1.50's password:
Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-89-generic x86_64)

System information as of Tue Sep 23 07:42:01 UTC 2025

System load: 0.23   Memory usage: 45%   Disk usage: 67%
Processes: 145       Users logged in: 1   IPv4 address: 192.168.1.50

Updates available: 5 security, 12 general. Run 'apt upgrade' to apply.
  `,
                        `
> ls -lah /var/www/app
-rw-r--r-- 1 root   root   4.1K Sep 21  2025 index.js
-rw-r--r-- 1 root   root   8.7K Sep 21  2025 server.js
-rw-r--r-- 1 root   root   512B Sep 21  2025 config.json
drwxr-xr-x 4 root   root   4.0K Sep 21  2025 logs
-rw-r--r-- 1 deploy deploy 3.2K Sep 21  2025 routes.js
drwxr-xr-x 2 deploy deploy 4.0K Sep 21  2025 public

Total: 28K across 6 files and 2 directories.`,
                        `
> npm run build

> app@1.0.0 build
> next build

info  - Loaded env from .env
info  - Checking validity of types...
info  - Creating an optimized production build...
info  - Compiled successfully in 29.8s
info  - Collecting page data...
info  - Generating static pages (12/12)
info  - Finalizing page optimization...

Route (pages)        Size     First Load JS
/                    2.5 kB   75.2 kB
/about               1.3 kB   68.2 kB
/dashboard           4.6 kB   82.5 kB

Build completed successfully!`,
                        `
> systemctl status nginx

● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
     Active: active (running) since Tue 2025-09-23 07:40:12 UTC; 1min ago
   Main PID: 11234 (nginx)
      Tasks: 3 (limit: 1142)
     Memory: 4.2M
        CPU: 45ms
     CGroup: /system.slice/nginx.service
             ├─11234 nginx: master process /usr/sbin/nginx -g daemon off;
             ├─11235 nginx: worker process
             └─11236 nginx: worker process

nginx is running normally with no errors detected.`]}
                    loop={1}
                    cursor
                    cursorStyle="█"
                    typeSpeed={25}
                    deleteSpeed={5}
                    delaySpeed={3000}
                />
            </Box>
        </Paper>
    );
}


export function ServerAnimation({ servers }: { servers: IServer[] }) {
    return (
        <Paper
            elevation={6}
            sx={{
                bgcolor: "black",
                color: "#00ff66",
                fontFamily: "monospace",
                p: 2,
                borderRadius: 2,
                width: '100%',
                mx: "auto",
                fontSize: 11,
                minHeight: 100
            }}
        >
            <Box sx={{ whiteSpace: "pre-wrap" }}>
                <Typewriter
                    words={
                        servers.map(x => `Server Name: ${x.title}\nHost: ${x.host}\nUser: ${x.user}`)
                    }
                    loop={0}
                    cursor
                    cursorStyle="█"
                    typeSpeed={25}
                    deleteSpeed={5}
                    delaySpeed={3000}
                />
            </Box>
        </Paper>
    );
}