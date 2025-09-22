import { SVGProps } from "react";

export function ProjectIcon(props: SVGProps<SVGSVGElement>) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
        <path fill="currentColor" d="M22 13.478V18a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-4.522l.553.277a21 21 0 0 0 18.897-.002zM14 2a3 3 0 0 1 3 3v1h2a3 3 0 0 1 3 3v2.242l-1.447.724a19 19 0 0 1-16.726.186l-.647-.32l-1.18-.59V9a3 3 0 0 1 3-3h2V5a3 3 0 0 1 3-3zm-2 8a1 1 0 0 0-1 1a1 1 0 1 0 2 .01c0-.562-.448-1.01-1-1.01m2-6h-4a1 1 0 0 0-1 1v1h6V5a1 1 0 0 0-1-1"></path>
    </svg>
}


export function RepoIcon(props: SVGProps<SVGSVGElement>) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
            <path d="M16 3v18l4-2.5v-13zM9.165 13.903L5 17.5l-2-1L7.333 12m1.735-1.802L16 3v5l-4.795 4.141"></path>
            <path d="M16 16.5L5 6.5l-2 1L16 21"></path>
        </g>
    </svg>
}


export function ServerIcon(props: SVGProps<SVGSVGElement>) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm12 13H6a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3h12M7 8v.01M7 16v.01M20 15l-2 3h3l-2 3"></path>
    </svg>
}

