import { IconButton } from "@mui/material";
import { CloneIcon } from "../icons";
import Link from "next/link";

type Props = {
    repositoryId: string
    size?: number
}
export function CloneButton({ repositoryId, size = 18 }: Props) {


    return <IconButton
        LinkComponent={Link}
        href={`/repos/save?cloneId=${repositoryId}`}
    >
        <CloneIcon width={size} height={size} />
    </IconButton>
}