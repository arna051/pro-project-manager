import { IRepo } from "@electron/model/repo"
import { Badge, CircularProgress, IconButton } from "@mui/material"
import { DeployIcon } from "../icons"
import { useDeploy } from "@next/deploy/context"

type Props = {
    size?: number
    repo: IRepo
}
export function DeployButton({ repo, size = 18 }: Props) {

    const { deploy, isDeploying } = useDeploy();

    const [isListed, isOnProgress] = isDeploying(repo);

    return <>
        <Badge badgeContent={isOnProgress ? <CircularProgress size={8} color="warning" /> : null}>
            <IconButton onClick={() => deploy(repo)} color={isListed ? "warning" : "inherit"}>
                <DeployIcon width={size} height={size} />
            </IconButton>
        </Badge>
        <IconButton className="deploy-button" sx={{ display: 'none' }} LinkComponent="a" onClick={() => deploy(repo)} href="#" />
    </>
}