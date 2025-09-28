import { Avatar, AvatarProps } from "@mui/material";
import { useEffect, useState } from "react";

type Props = AvatarProps
export function FsAvatar(props: Props) {
    const [src, setSrc] = useState(props.src);

    useEffect(() => {
        if (!props.src) return;
        window.electron.gridfs.get(props.src)
            .then(res => {
                setSrc(`data:${res.file.contentType ?? "image/*"};base64,${res.base64}`)
            })
            .catch(console.error);
    }, [props.src])
    return <Avatar
        {...props}
        src={src}
    />
}