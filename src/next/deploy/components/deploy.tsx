import { useEffect, useRef, useState } from "react";
import { DeployType } from "../type";
import { Terminal } from "@xterm/xterm";
import { Box, Button, CircularProgress, Divider, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography, useTheme } from "@mui/material";
import { FitAddon } from '@xterm/addon-fit';
import { DeployIcon, DurationIcon, SelectIcon } from "@next/components/icons";
import { toast } from "sonner";
import { IServer } from "@electron/model/server";
import { TimeDiff } from "@next/utils/time";


let timeout: any = null
export default function Deploy({ deploy, changeDeploy }: { deploy: DeployType, changeDeploy: (id: string, dep: Partial<DeployType>) => void }) {
    const termRef = useRef<HTMLDivElement | null>(null);

    const theme = useTheme();

    const [initiated, setInitiated] = useState(false);

    const [tasks, setTasks] = useState<string[]>([]);

    const [form, setForm] = useState({
        selectedBranch: deploy.currentBranch,
        build: true,
        push: true,
        initialCommand: '',
        deployScriptIndex: 0
    });

    const update = (x: Partial<DeployType>) => changeDeploy(deploy.id, x)
    const task = (s: string) => `echo "\n[project-manager] ${s}\n"`;
    const getTask = (s: string) => /\[project\-manager\] (.+)/g.exec(s)?.[1] || ""

    async function handleDeploy() {

        setTasks([])

        const deployScript = deploy.repo.deployScript[form.deployScriptIndex];

        if (!deployScript) return toast.warning("this repository doesn't have any deploy script.");

        update({ deploying: true, startTime: Date.now(), endTime: undefined })

        const git = deploy.branches.length ? [
            task(`changing branch to ${form.selectedBranch}`),
            `git checkout ${form.selectedBranch}`,
            'git add .',
            task(`commit changes ${new Date().toString()}`),
            `git commit -m "deploy at ${new Date().toString()}"`,
            form.push ? task(`pushing to origin/${form.selectedBranch}`) : '',
            form.push ? `git push origin ${form.selectedBranch}` : 'echo "skip pushing change to origin"',
        ] : []

        const bash = [
            `cd "${deploy.repo.path}"`,
            task("Start Deploying"),
            ...git,
            form.build ? task(`building production mode via "${deploy.repo.buildCommand}"`) : '',
            form.build ? deploy.repo.buildCommand : 'echo "skip building..."',
            form.initialCommand,
            task("deploying by repo scripts...")
        ];

        if (deployScript.serverIds.length) {
            const servers = await window.electron.db.find<IServer>("Server")
            for (let index = 0; index < deployScript.serverIds.length; index++) {
                const _id = deployScript.serverIds[index];
                const server = servers.find(x => `${x._id}` === `${_id}`);

                if (!server) continue;

                const bashScript = deployScript.script.replace(/\$1/g, `${server.user}@${server.host} -p ${server.port}`);

                bash.push(task(`Deploy on ${server.title} - [${server.user}@${server.host} -p ${server.port}]`));
                bash.push(bashScript);
                bash.push(task(`Deployed on ${server.title}`));
            }
        } else {
            bash.push(deployScript.script)
        }


        bash.push(
            "echo '\n'",
            "echo '\n'",
            "echo '\n'",
            task("deployment task is done")
        );


        const bashFile = await window.electron.terminal.createBash(bash.join("\n"))


        window.electron.terminal.write(deploy.termId, bashFile);

        window.electron.terminal.write(deploy.termId, "\n");

    }

    useEffect(() => {
        const term = new Terminal({
            fontFamily: "monospace",
            fontSize: 14,
            cursorBlink: true,
            allowTransparency: true,
            theme: {
                background: "#00000000",
                foreground: theme.palette.text.primary,
                selectionBackground: "#00000000",
            },

        });
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(termRef.current!);
        fitAddon.fit();
        // show output from shell
        window.electron.terminal.onData(deploy.termId, (data) => {
            term.write(data);
            if (data.includes("deployment task is done")) {
                update({ deploying: false, endTime: Date.now() })
            }
            const taskDone = getTask(data);
            if (taskDone) setTasks(last => {
                if (last.some(x => x === taskDone)) return last;

                return [...last, taskDone]
            })
        });

        // forward keystrokes to shell
        term.onData((input) => {
            window.electron.terminal.write(deploy.termId, input);
        });

        const fit = () => {
            const cols = term.cols;
            const rows = term.rows;
            window.electron.terminal.resize(deploy.termId, cols, rows);
        };
        fit();
        term.focus();

        return () => {
            term.dispose();
        };
    }, []);


    useEffect(() => {
        if (!termRef.current || initiated) return;
        setInitiated(true);
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            window.electron.terminal.write(deploy.termId, `cd "${deploy.repo.path}"`);
            window.electron.terminal.write(deploy.termId, "\n");
            window.electron.terminal.write(deploy.termId, "la");
            window.electron.terminal.write(deploy.termId, "\n");
        }, 1e3);
    }, [termRef.current]);

    return (
        <Grid container spacing={1} sx={{ height: '100%' }}>
            <Grid size={{ xs: 12, md: 4 }} sx={{ height: '100%', position: 'relative' }}>
                <Box sx={{
                    px: 4,
                    py: 2,
                    height: '100%',
                    overflowY: 'scroll',
                    position: 'relative',
                    pb: 12
                }}>
                    <Stack gap={2}>
                        {!!deploy.branches.length && <FormControl fullWidth>
                            <InputLabel id="selected-branch-label">Selected Branch</InputLabel>
                            <Select
                                labelId="selected-branch-label"
                                value={form.selectedBranch}
                                label="Selected Branch"
                                onChange={e => setForm(last => ({ ...last, selectedBranch: e.target.value }))}>
                                {
                                    deploy.branches.map(x => <MenuItem key={x} value={x}>{x}</MenuItem>)
                                }
                            </Select>
                        </FormControl>}
                        <FormControl fullWidth>
                            <InputLabel id="selected-deploy-label">Deploy Script</InputLabel>
                            <Select labelId="selected-deploy-label"
                                value={form.deployScriptIndex}
                                label="Deploy Script"
                                onChange={e => setForm(last => ({ ...last, deployScriptIndex: e.target.value }))}>
                                {
                                    deploy.repo.deployScript.map((x, i) => <MenuItem key={x.name} value={i}>{x.name}</MenuItem>)
                                }
                            </Select>
                        </FormControl>

                        <TextField
                            value={form.initialCommand}
                            label="initial commands"
                            onChange={e => setForm(last => ({ ...last, initialCommand: e.target.value }))}
                            multiline
                            rows={5}
                        />

                        <FormControlLabel
                            label="Build before deploy"
                            control={<Switch checked={form.build} onChange={(_, x) => setForm(last => ({ ...last, build: x }))} />}
                        />
                        {
                            !!deploy.branches.length && <FormControlLabel
                                label="Push to remote"
                                control={<Switch checked={form.push} onChange={(_, x) => setForm(last => ({ ...last, push: x }))} />}
                            />
                        }
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Stack gap={1}>
                        {
                            tasks.map((x, i) => <Stack key={i} direction="row" alignItems="center" gap={1}>
                                <SelectIcon width={16} height={16} />
                                <Typography fontSize={12}>{x}</Typography>
                            </Stack>)
                        }
                        {
                            !!deploy.deploying && <Stack direction="row" alignItems="center" gap={1}>
                                <CircularProgress size={13} thickness={5} color="warning" />
                                <Typography fontSize={12} color="warning.main">Working...</Typography>
                            </Stack>
                        }
                        {
                            !!(deploy.startTime && deploy.endTime) && <Stack direction="row" alignItems="center" gap={1}>
                                <DurationIcon width={16} height={16} />
                                <Typography fontSize={12}>{TimeDiff(deploy.startTime, deploy.endTime)}</Typography>
                            </Stack>
                        }
                    </Stack>
                </Box>

                <Button
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        m: 4
                    }}
                    variant="contained"
                    color="warning"
                    startIcon={<DeployIcon />}
                    onClick={handleDeploy}
                    className="start-deploy-button"
                >
                    Start Deploy!
                </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
                <Box
                    ref={termRef}
                    sx={{
                        width: "100%",
                        height: "100%",
                        overflow: 'hidden'
                    }}
                />
            </Grid>
        </Grid>
    );
}
