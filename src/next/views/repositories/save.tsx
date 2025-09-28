import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Card, CardContent, CardHeader, Chip, Grid, IconButton, InputAdornment, MenuItem, Rating, Stack, Typography } from "@mui/material";
import BGFade from "@next/components/bg-fade";
import Hero from "@next/components/hero";
import { Field, Form } from "@next/components/hook-form";
import { AddIcon, DeleteIcon, DeployIcon, FolderSelectIcon, ProjectIcon, RepoIcon, SaveIcon, ServerIcon, VscodeIcon } from "@next/components/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { RepoSchema } from "@next/validation/repo";
import { IProject } from "@electron/model/project";
import { FsAvatar } from "@next/components/avatar";
import { getProjects } from "@next/api/projects";
import { ICONS } from "@next/constants/repo-icons";
import { DEPLOY_TEMPLATE } from "@next/constants/deploy";
import { IRepo } from "@electron/model/repo";
import { useTerminal } from "@next/terminal";


const initial = {
    projectId: '',
    title: '',
    path: '',
    devCommand: 'npm run dev',
    buildCommand: 'npm run build',
    deployScript: [],
    icon: [],
    ignore: ['node_modules', '.git', '.vscode', 'package-lock.json', 'yarn.lock', 'build', 'dest', 'out', 'dist', '.next', 'src/next/.next'].join(", "),
    git: ''
}


export default function RepositoriesSave() {
    const params = useSearchParams();
    const router = useRouter();

    const { create } = useTerminal()

    const id = params.get("id");
    const cloneId = params.get("cloneId");
    const projectId = params.get("projectId");
    const returnTo = params.get("returnTo");

    const [projects, setProjects] = useState<IProject[]>([])

    const methods = useForm<any>({
        resolver: zodResolver(RepoSchema),
        defaultValues: initial,
    });


    const {
        handleSubmit,
        setValue,
        reset,
        watch,
        control
    } = methods;


    const { fields: deployScripts, append, remove } = useFieldArray({
        control,
        name: "deployScript",
    });


    const onSubmit = handleSubmit((data: IRepo) => {
        if (id) return window
            .electron
            .db
            .update("Repo", { _id: id }, { $set: data })
            .then(() => {
                toast.success("Repository was saved!")
                if (returnTo) return router.push(`/projects/show?id=${returnTo}`)
                router.push("/repos");
            })
            .catch(err => {
                toast.error(err instanceof Error ? err.message : "We have an error!")
            })

        window
            .electron
            .db
            .save("Repo", data)
            .then(async () => {
                toast.success("Repository was saved!")
                if (returnTo) return router.push(`/projects/show?id=${returnTo}`)
                router.push("/repos");

                const remote_repo: string = (data as any).git
                if (remote_repo) {
                    create("clone", `git clone "${remote_repo}" "${data.path}"`)
                }

                if (!cloneId) return;
                try {
                    const old_repo = await window.electron.db.doc("Repo", [{ $match: { _id: cloneId } }]);

                    if (!old_repo) return;

                    window.electron.terminal.copyFiles(old_repo.path, data.path, data.ignore.split(",").map(x => x.trim()));
                }
                catch (err) {
                    toast.error(err instanceof Error ? err.message : "clone failed!")
                }
            })
            .catch(err => {
                toast.error(err instanceof Error ? err.message : "We have an error!")
            })
    })


    useEffect(() => {
        getProjects()
            .then(res => {
                setProjects(res)
            })
            .catch(err => {
                toast.error(err instanceof Error ? err.message : "We have an error!")
            });

        if (!id && !cloneId) return;

        window
            .electron
            .db
            .doc("Repo", [{ $match: { _id: id || cloneId } }])
            .then(res => {
                if (!res) return;
                Object.keys(initial).forEach(key => {
                    if (cloneId && key === 'path') return;
                    setValue(key, res[key])
                })
            })
            .catch(err => {
                toast.error(err instanceof Error ? err.message : "We have an error!")
            });
    }, [id, cloneId]);

    useEffect(() => {
        if (!projectId) return;
        setValue("projectId", projectId);
    }, [projectId]);


    const selectedProjectId = watch("projectId");
    const path = watch("path");

    const selectedProject: IProject | undefined = projects.find(x => x._id === selectedProjectId)
    return <Box
        sx={{
            p: 2,
            pt: 6,
            position: 'relative'
        }}>
        <Form methods={methods} onSubmit={onSubmit}>
            <BGFade height={800} />
            <Hero
                icon={RepoIcon}
                title="Save Repository"
                subtitle="Save project repository"
                button={{
                    text: "Save",
                    icon: <SaveIcon />
                }}
                reset={reset}
            />

            <Grid container spacing={2} sx={{ position: 'relative', my: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack gap={2}>
                        <Card className="glassy">
                            <CardHeader
                                title="Repository Details"
                                subheader="basic repository information"
                                avatar={<VscodeIcon />}
                            />
                            <CardContent>
                                <Stack
                                    gap={2}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Field.MultiSelect
                                        fullWidth
                                        options={ICONS.map(x => ({
                                            value: x.value,
                                            label: <Stack direction="row" alignItems="center" gap={2} key={x.value}>
                                                {x.icon}
                                                <Typography fontWeight="bold" fontSize={11}>
                                                    {x.name}
                                                </Typography>
                                            </Stack>
                                        }))}

                                        label="Icons"
                                        name="icon"
                                        placeholder="Icons"
                                    />
                                    <Field.Text name="title" label="Repo Name" />
                                    <Field.Text
                                        name="path"
                                        label="Path"
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position="end">
                                                    <IconButton onClick={() => {
                                                        window.electron.dialog.openFile({ properties: ["createDirectory", "openDirectory"] })
                                                            .then(res => {
                                                                if (!res.filePaths[0]) return;
                                                                setValue("path", res.filePaths[0])
                                                            })
                                                    }}>
                                                        <FolderSelectIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        }}
                                    />
                                    {!!cloneId && <Field.Text name="ignore" label="Files & folder to ignore for clone." helperText="comma separated" />}
                                    {!!path && !cloneId && !id && <Field.Text name="git" label="clone from an remote" helperText="repository in github or gitlab" />}
                                    <Field.Text name="devCommand" label="Development command" />
                                    <Field.Text name="buildCommand" label="Production Build command" />
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card className="glassy">
                            <CardHeader
                                title="Deploy Scripts"
                                subheader="Create deploy method for repo"
                                avatar={<ServerIcon />}
                                action={<IconButton
                                    onClick={() => append({ name: '', serverIds: [], script: DEPLOY_TEMPLATE })}
                                >
                                    <AddIcon />
                                </IconButton>}
                            />
                        </Card>

                        {
                            deployScripts.map((_, i) => <Card className="glassy" key={i}>
                                <CardHeader
                                    title={`Deploy Script ${i + 1}`}
                                    avatar={<DeployIcon />}
                                    action={<IconButton
                                        onClick={() => remove(i)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>}
                                />

                                <CardContent>
                                    <Stack gap={2}>
                                        <Field.Text name={`deployScript.${i}.name`} label="Name" />

                                        <Field.MultiSelect
                                            label="Servers"
                                            placeholder="Select Servers"
                                            options={selectedProject?.servers ? selectedProject.servers.map(x => ({ label: x.title, value: x._id.toString() })) : []}
                                            name={`deployScript.${i}.serverIds`}
                                            fullWidth
                                            chip
                                        />
                                        <Field.Code
                                            name={`deployScript.${i}.script`}

                                        />
                                    </Stack>
                                </CardContent>
                            </Card>)
                        }
                    </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack gap={2}>
                        <Card className="glassy">
                            <CardHeader
                                title="Project"
                                subheader="select which project is the owner of this repo"
                                avatar={<ProjectIcon />}
                            />
                            <CardContent>
                                <Stack
                                    gap={2}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Field.Select name="projectId" label="Project">
                                        {
                                            projects.map(x => <MenuItem
                                                key={`${x._id}`}
                                                value={`${x._id}`}>
                                                <Stack direction="row" alignItems="center" gap={2}>
                                                    <FsAvatar
                                                        src={x.image}
                                                        alt={x.title}
                                                        variant="rounded"
                                                    />
                                                    <Typography variant="subtitle2">
                                                        {x.title}
                                                    </Typography>
                                                </Stack>
                                            </MenuItem>)
                                        }
                                    </Field.Select>
                                </Stack>
                            </CardContent>
                            {
                                !!selectedProject &&
                                <Stack gap={2}>
                                    <FsAvatar
                                        src={selectedProject.image}
                                        variant="square"
                                        sx={{
                                            width: '100%',
                                            height: 200,
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <CardContent>
                                        <Stack gap={2}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Project Name:
                                                </Typography>
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    {selectedProject.title}
                                                </Typography>
                                            </Stack>

                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Priority
                                                </Typography>
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    <Rating
                                                        readOnly
                                                        size="small"
                                                        value={selectedProject.priority}
                                                    />
                                                </Typography>
                                            </Stack>


                                            <Box component="div" dangerouslySetInnerHTML={{ __html: selectedProject.description || "" }} />
                                        </Stack>
                                    </CardContent>
                                </Stack>
                            }

                        </Card>

                        {
                            selectedProject?.contractors?.map((c, i) => <Card className="glassy" key={`${c._id}`}>
                                <CardContent>
                                    <Stack direction="row" gap={2}>
                                        <FsAvatar
                                            src={c.avatar}
                                            alt={c.name}
                                        />
                                        <Stack sx={{ flex: '1 1 auto' }}>
                                            <Typography>{c.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {c.phones[0] || c.address}
                                            </Typography>
                                        </Stack>
                                        <Chip
                                            label={`Contractor ${i + 1}`}
                                            color="success"
                                            variant={i === 0 ? "filled" : "outlined"}
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>)
                        }

                        {
                            selectedProject?.repos?.map((c) => <Card className="glassy" key={`${c._id}`}>
                                <CardContent>
                                    <Stack direction="row" gap={2}>
                                        <Stack sx={{ flex: '1 1 auto' }}>
                                            <Typography>{c.title}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {c.path}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row" gap={1} sx={{ mt: 2 }}>

                                        {
                                            c.icon
                                                .map(r => ICONS.find(t => t.value === r))
                                                .filter(Boolean)
                                                .map(r => <Chip
                                                    label={r?.name}
                                                    key={r?.value}
                                                    icon={r?.icon}
                                                />)
                                        }
                                    </Stack>
                                </CardContent>
                            </Card>)
                        }
                    </Stack>
                </Grid>
            </Grid>
        </Form>
    </Box>
}