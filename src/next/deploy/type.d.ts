import { IRepo } from "@electron/model/repo";

export interface DeployContextType {
    deploy: (repo: IRepo) => void
    isDeploying: (repo: IRepo) => [boolean, boolean]
    open: VoidFunction
    deploying: number
    deploys: number
}

export interface DeployType {
    id: string
    repo: IRepo
    branches: string[]
    currentBranch: string
    dirty: boolean

    termId: string

    deploying: boolean
    startTime?: number
    endTime?: number
}