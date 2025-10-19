import Project from "@electron/model/project"
import Server from "@electron/model/server";
import { main } from "@electron/windows/app"
import { Menu, Tray } from "electron"
import { join } from "path"

function handleClick(path: string) {
    main?.webContents.send("message-from-main", { path })
    main?.focus();
    main?.show();
}
function handleClickServer(server: string) {
    main?.webContents.send("message-from-main", { server })
    main?.focus();
    main?.show();
}

export async function TracyRender() {
    try {
        const projectDocs = await Project.find().lean();
        const serverDocs = await Server.find().lean();

        const projectItems = projectDocs.map(project => ({
            label: project.title ?? "Untitled Project",
            click: () => handleClick(`/projects/show?id=${project._id}`)
        }));

        const serverItems = serverDocs.map(server => ({
            label: server.title ?? `${server.user}@${server.host}`,
            click: () => handleClickServer(`${server.user}@${server.host} -p ${server.port}`)
        })).filter(item => Boolean(item.label));

        const contextMenu = Menu.buildFromTemplate([
            {
                label: "Open App",
                click: () => {
                    main?.focus();
                    main?.show();
                }
            },
            {
                label: "Open Terminal",
                click: () => {
                    main?.focus();
                    main?.show();
                    main?.webContents.send("message-from-main", { terminal: "new" })
                }
            },
            {
                label: "Projects",
                submenu: projectItems.length ? projectItems : [{ label: "No projects", enabled: false }]
            },
            {
                label: "Servers",
                submenu: serverItems.length ? serverItems : [{ label: "No servers", enabled: false }]
            }
        ]);

        const tray = new Tray(join(__dirname, "../assets/hippogriff.png"))
        tray.setContextMenu(contextMenu);
    }
    catch (err) {
        console.log(err);
    }
}
