import { AddToolProps } from "easy-llm-call";
import { actions } from "../actions";
import { IRepo } from "@electron/model/repo";
import { IServer } from "@electron/model/server";
import { SETTINGS } from "@next/constants/settings";

export const repo_tools: AddToolProps[] = [
    {
        ...actions.push_all_to_git,
        func: async () => {
            const repos = await window.electron.db.find<IRepo>("Repo");

            let results = ''


            for (let index = 0; index < repos.length; index++) {
                const { path, title } = repos[index];
                const push = `cd "${path}" && git add . && git commit -m "${new Date().toString()}" && git push origin --all && exit`;
                const res = await window.electron.terminal.execute(push);
                results += `-----\n${title}:\n${res}\n-----\n\n`
            };

            return results;

        },
    },
    {
        ...actions.deploy_repo,
        props: {
            repoId: {
                type: 'string',
                desc: 'repoId that you want to deploy.',
                required: true
            },
            deployName: {
                type: 'string',
                desc: 'selected deploy script name.',
                required: true,
            }
        },
        func: async ({ repoId, deployName }) => {
            const repo = await window.electron.db.doc<IRepo>("Repo", [
                { $match: { _id: repoId } }
            ]);

            if (!repo) return "repo not found!";

            const deploy = repo.deployScript.find(x => x.name === deployName);

            if (!deploy) return "deploy script not found"

            let results = ''
            if (deploy.serverIds.length) {
                const servers = await window.electron.db.list<IServer>("Server", [
                    {
                        $match: {
                            _id: { $in: deploy.serverIds }
                        }
                    }
                ])

                for (let index = 0; index < servers.length; index++) {
                    const server = servers[index];

                    const bashScript = deploy
                        .script
                        .replace(/\$1/g, `${server.user}@${server.host}`)
                        .replace(/\$2/g, `${server.port}`);

                    const bashFile = await window.electron.terminal.createBash(bashScript)
                    results += `\n${await window.electron.terminal.execute(`bash ${bashFile}`)}\n`
                }
            } else {
                const bashFile = await window.electron.terminal.createBash(deploy.script)
                results += `\n${await window.electron.terminal.execute(`bash ${bashFile}`)}\n`
            }

            return results;

        },
    },
    {
        ...actions.execute_on_repo,
        props: {
            repoId: {
                type: 'string',
                desc: 'repoId that you want to run command on.',
                required: true,
            },
            command: {
                type: 'string',
                desc: 'command you want to execute',
                required: true,
            }
        },
        func: async ({ repoId, command }) => {
            const repo = await window.electron.db.doc<IRepo>("Repo", [
                { $match: { _id: repoId } }
            ]);

            if (!repo) return "repo not found!";

            return window.electron.terminal.execute(`cd ${repo.path} && ${command}`)

        },
    },
    {
        ...actions.open_repo_for_user,
        props: {
            repoId: {
                type: 'string',
                desc: 'repoId that you want to open for user.',
                required: true,
            },
        },
        func: async ({ repoId }) => {
            const repo = await window.electron.db.doc<IRepo>("Repo", [
                { $match: { _id: repoId } }
            ]);

            if (!repo) return "repo not found!";

            const setting = await window.electron.db.doc("Setting", [
                {
                    $match: {
                        key: SETTINGS.ide
                    }
                }
            ]);

            if (setting) return window.electron.terminal.execute(setting.value.replace("$1", repo.path))
            return window.electron.terminal.execute(`code "${repo.path}"`)

        },
    },
]