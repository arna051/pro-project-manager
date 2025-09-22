import { SVGProps } from "react";

export function TodoIcon(props: SVGProps<SVGSVGElement>) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5h8m-8 4h5m-5 6h8m-8 4h5M3 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zm0 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"></path>
    </svg>
}

export function NoteIcon(props: SVGProps<SVGSVGElement>) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20a2 2 0 1 0 4 0a2 2 0 1 0-4 0m0 0H4m10 0h6m-8-5l-2-2H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-3zM9 6h6M9 9h3"></path>
    </svg>
}

export function BashIcon(props: SVGProps<SVGSVGElement>) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m7 8l-4 4l4 4m10-8l4 4l-4 4M14 4l-4 16"></path>
    </svg>
}
