import { useEffect, useRef, useState } from "react";
import { DeployType } from "../type";
import { Terminal } from "@xterm/xterm";
import { Box, Button, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Stack, Switch, TextField, useTheme } from "@mui/material";
import { FitAddon } from '@xterm/addon-fit';
import { DeployIcon } from "@next/components/icons";
import { toast } from "sonner";
import { IServer } from "@electron/model/server";


let timeout: any = null
export default function Deploy({ deploy }: { deploy: DeployType }) {
    const termRef = useRef<HTMLDivElement | null>(null);

    const theme = useTheme();

    const [initiated, setInitiated] = useState(false);
    const [form, setForm] = useState({
        selectedBranch: deploy.currentBranch,
        build: true,
        push: true,
        initialCommand: '',
        deployScriptIndex: 0
    });


    async function handleDeploy() {

        const deployScript = deploy.repo.deployScript[form.deployScriptIndex];;

        if (!deployScript) return toast.warning("this repository doesn't have any deploy script.");

        const bash = [
            `cd "${deploy.repo.path}"`,
            'echo "Start Deploying"',
            `git checkout ${form.selectedBranch}`,
            'git add .',
            `git commit -m "deploy at ${new Date().toString()}"`,
            form.push ? `git push origin ${form.selectedBranch}` : 'echo "skip pushing change to origin"',
            form.initialCommand,
            'echo "deploying by repo scripts..."'
        ];

        if (deployScript.serverIds.length) {
            const servers = await window.electron.db.find<IServer>("Server")
            for (let index = 0; index < deployScript.serverIds.length; index++) {
                const _id = deployScript.serverIds[index];
                const server = servers.find(x => `${x._id}` === `${_id}`);

                if (!server) continue;

                const bashScript = deployScript.script.replace(/\$1/g, `${server.user}@${server.host}`);

                bash.push(`echo "Deploy on ${server.title} - [${server.user}@${server.host} -p ${server.port}]"`);
                bash.push(bashScript);
                bash.push(`echo "Deployed on ${server.title}"`);
            }
        } else {
            bash.push(deployScript.script)
        }


        bash.push(
            "echo '\n'",
            "echo '\n'",
            "echo '\n'",
            "echo 'deployment task is done'"
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
            <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ px: 4, py: 2, height: '100%', position: 'relative', pb: 8 }}>
                    <Stack gap={2}>
                        <FormControl fullWidth>
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
                        </FormControl>
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
                        <FormControlLabel
                            label="Push to remote"
                            control={<Switch checked={form.push} onChange={(_, x) => setForm(last => ({ ...last, push: x }))} />}
                        />
                    </Stack>

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
                    >
                        Start Deploy!
                    </Button>
                </Box>
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