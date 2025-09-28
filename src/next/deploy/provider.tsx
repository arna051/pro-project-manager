"use client"

import { useState } from "react";
import { deployContext } from "./context";
import { DeployType } from "./type";
import { IRepo } from "@electron/model/repo";
import { toast } from "sonner";
import DeployDialog from "./components/dialog";

const Provider = deployContext.Provider;

export function DeployProvider({ children }: ChildProp) {
    const [deploys, setDeploys] = useState<DeployType[]>([]);
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState(0);

    function deploy(repo: IRepo) {
        const exists = deploys.findIndex(x => x.id === `${repo._id}`);
        if (exists >= 0) {
            setActiveTab(exists);
            setOpen(true);
        }
        window.electron.terminal.git(repo.path)
            .then(async res => {
                const termId = await window.electron.terminal.create();
                setDeploys(last => [...last, {
                    id: repo._id.toString(),
                    termId,
                    branches: res.branches,
                    dirty: res.dirty,
                    currentBranch: res.currentBranch,
                    deploying: false,
                    repo
                }])
            })
            .catch(err => toast.error(err instanceof Error ? err.message : "failed to get repo git data"));
    }

    function closeDeploy(id: string) {
        setDeploys(last => last.filter(x => x.id !== id))
    }

    return <>
        <Provider value={{
            deploy,
            open: () => setOpen(true),
            deploying: deploys.filter(x => x.deploying).length,
            deploys: deploys.length,
            isDeploying(repo) {
                const d = deploys.find(x => x.id === repo._id.toString())
                return [!!d, !!d?.deploying]
            },
        }}>
            {children}
        </Provider>
        <DeployDialog
            open={open}
            onClose={() => setOpen(false)}
            activeTab={activeTab}
            closeDeploy={closeDeploy}
            deploys={deploys}
            setActiveTab={setActiveTab}
        />
    </>
}