
export const Icon = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
        <mask id="SVG72LTUchX">
            <path fill="none" stroke="#fff" strokeDasharray={48} strokeDashoffset={48} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.64 19.36c-3.52 -3.51 -3.52 -9.21 0 -12.72c3.51 -3.52 9.21 -3.52 12.72 -0c3.52 3.51 3.52 9.21 0 12.72">
                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="48;0"></animate>
            </path>
            <g transform="rotate(-100 12 13)">
                <path d="M12 14C12 14 12 14 12 14C12 14 12 14 12 14C12 14 12 14 12 14C12 14 12 14 12 14Z">
                    <animate fill="freeze" attributeName="d" begin="0.4s" dur="0.2s" values="M12 14C12 14 12 14 12 14C12 14 12 14 12 14C12 14 12 14 12 14C12 14 12 14 12 14Z;M17 13C17 15.7614 14.7614 18 12 18C9.23858 18 7 15.7614 7 13C7 10.2386 12 -2 12 -2C12 -2 17 10.2386 17 13Z"></animate>
                </path>
                <path fill="#fff" d="M12 14C12 14 12 14 12 14C12 14 12 14 12 14C12 14 12 14 12 14C12 14 12 14 12 14Z">
                    <animate fill="freeze" attributeName="d" begin="0.4s" dur="0.2s" values="M12 14C12 14 12 14 12 14C12 14 12 14 12 14C12 14 12 14 12 14C12 14 12 14 12 14Z;M15 13C15 14.6568 13.6569 16 12 16C10.3431 16 9 14.6568 9 13C9 11.3431 12 2 12 2C12 2 15 11.3431 15 13Z"></animate>
                </path>
                <animateTransform attributeName="transform" begin="0.4s" dur="6s" repeatCount="indefinite" type="rotate" values="-100 12 13;65 12 13;65 12 13;65 12 13;30 12 13;10 12 13;0 12 13;35 12 13;55 12 13;65 12 13;75 12 13;15 12 13;-20 12 13;-100 12 13"></animateTransform>
            </g>
        </mask>
        <rect width={24} height={24} fill="currentColor" mask="url(#SVG72LTUchX)"></rect>
    </svg>
}

export const StatusIcon = ({ messages, size = 18, loading }: { messages: any[], size?: number, loading?: boolean }) => {

    if (!loading) return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
        <mask id="SVGfUZuVbjp">
            <g fill="#fff">
                <path fillOpacity={0} stroke="#fff" strokeDasharray={48} strokeDashoffset={48} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9.42c4.42 0 8 2.37 8 5.29c0 2.92 -3.58 5.29 -8 5.29c-4.42 0 -8 -2.37 -8 -5.29c0 -2.92 3.58 -5.29 8 -5.29Z">
                    <animate fill="freeze" attributeName="fill-opacity" begin="0.6s" dur="0.4s" values="0;1"></animate>
                    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="48;0"></animate>
                </path>
                <circle cx={7.24} cy={11.97} r={2.24} opacity={0}>
                    <animate fill="freeze" attributeName="cx" begin="1s" dur="0.2s" values="7.24;3.94"></animate>
                    <set fill="freeze" attributeName="opacity" begin="1s" to={1}></set>
                </circle>
                <circle cx={16.76} cy={11.97} r={2.24} opacity={0}>
                    <animate fill="freeze" attributeName="cx" begin="1s" dur="0.2s" values="16.76;20.06"></animate>
                    <set fill="freeze" attributeName="opacity" begin="1s" to={1}></set>
                </circle>
                <circle cx={18.45} cy={4.23} r={1.61} opacity={0}>
                    <animate attributeName="cx" begin="2.4s" dur="6s" repeatCount="indefinite" values="18.45;5.75;18.45"></animate>
                    <set fill="freeze" attributeName="opacity" begin="2.6s" to={1}></set>
                </circle>
            </g>
            <path fill="none" stroke="#fff" strokeDasharray={12} strokeDashoffset={12} strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M12 8.75L13.18 3.11L18.21 4.18">
                <animate attributeName="d" begin="2.4s" dur="6s" repeatCount="indefinite" values="M12 8.75L13.18 3.11L18.21 4.18;M12 8.75L12 2L12 4.18;M12 8.75L10.82 3.11L5.79 4.18;M12 8.75L12 2L12 4.18;M12 8.75L13.18 3.11L18.21 4.18"></animate>
                <animate fill="freeze" attributeName="stroke-dashoffset" begin="2.4s" dur="0.2s" values="12;0"></animate>
            </path>
            <g fillOpacity={0}>
                <circle cx={8.45} cy={13.59} r={1.61}>
                    <animate fill="freeze" attributeName="fill-opacity" begin="1.2s" dur="0.4s" values="0;1"></animate>
                </circle>
                <circle cx={15.55} cy={13.59} r={1.61}>
                    <animate fill="freeze" attributeName="fill-opacity" begin="1.6s" dur="0.4s" values="0;1"></animate>
                </circle>
            </g>
            <path fill="none" stroke="#000" strokeDasharray={10} strokeDashoffset={10} strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M8.47 17.52c0 0 0.94 1.06 3.53 1.06c2.58 0 3.53 -1.06 3.53 -1.06">
                <animate fill="freeze" attributeName="stroke-dashoffset" begin="2s" dur="0.2s" values="10;0"></animate>
            </path>
        </mask>
        <rect width={24} height={24} fill="currentColor" mask="url(#SVGfUZuVbjp)"></rect>
    </svg>

    return messages[messages.length - 1]?.tool_calls ?
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <defs>
                <symbol id="SVGf9bFLczd">
                    <path d="M15.24 6.37C15.65 6.6 16.04 6.88 16.38 7.2C16.6 7.4 16.8 7.61 16.99 7.83C17.46 8.4 17.85 9.05 18.11 9.77C18.2 10.03 18.28 10.31 18.35 10.59C18.45 11.04 18.5 11.52 18.5 12">
                        <animate fill="freeze" attributeName="d" begin="0.9s" dur="0.2s" values="M15.24 6.37C15.65 6.6 16.04 6.88 16.38 7.2C16.6 7.4 16.8 7.61 16.99 7.83C17.46 8.4 17.85 9.05 18.11 9.77C18.2 10.03 18.28 10.31 18.35 10.59C18.45 11.04 18.5 11.52 18.5 12;M15.24 6.37C15.65 6.6 16.04 6.88 16.38 7.2C16.38 7.2 19 6.12 19.01 6.14C19.01 6.14 20.57 8.84 20.57 8.84C20.58 8.87 18.35 10.59 18.35 10.59C18.45 11.04 18.5 11.52 18.5 12"></animate>
                    </path>
                </symbol>
            </defs>
            <g fill="none" stroke="currentColor" strokeWidth={2}>
                <g strokeLinecap="round">
                    <path strokeDasharray={20} strokeDashoffset={20} d="M12 9c1.66 0 3 1.34 3 3c0 1.66 -1.34 3 -3 3c-1.66 0 -3 -1.34 -3 -3c0 -1.66 1.34 -3 3 -3Z">
                        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="20;0"></animate>
                    </path>
                    <path strokeDasharray={48} strokeDashoffset={48} d="M12 5.5c3.59 0 6.5 2.91 6.5 6.5c0 3.59 -2.91 6.5 -6.5 6.5c-3.59 0 -6.5 -2.91 -6.5 -6.5c0 -3.59 2.91 -6.5 6.5 -6.5Z">
                        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.6s" values="48;0"></animate>
                        <set fill="freeze" attributeName="opacity" begin="0.9s" to={0}></set>
                    </path>
                </g>
                <g opacity={0}>
                    <use href="#SVGf9bFLczd"></use>
                    <use href="#SVGf9bFLczd" transform="rotate(60 12 12)"></use>
                    <use href="#SVGf9bFLczd" transform="rotate(120 12 12)"></use>
                    <use href="#SVGf9bFLczd" transform="rotate(180 12 12)"></use>
                    <use href="#SVGf9bFLczd" transform="rotate(240 12 12)"></use>
                    <use href="#SVGf9bFLczd" transform="rotate(300 12 12)"></use>
                    <set fill="freeze" attributeName="opacity" begin="0.9s" to={1}></set>
                    <animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"></animateTransform>
                </g>
            </g>
        </svg>
        :
        messages[messages.length - 1]?.tool_call_id ?
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
                <mask id="SVGSL28tckf">
                    <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                        <path fill="#fff" fillOpacity={0} strokeDasharray={64} strokeDashoffset={64} d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z">
                            <animate fill="freeze" attributeName="fill-opacity" begin="0.6s" dur="0.5s" values="0;1"></animate>
                            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"></animate>
                        </path>
                        <path fill="#000" stroke="none" d="M11 11L12 12L13 13L12 12z" transform="rotate(-180 12 12)">
                            <animate fill="freeze" attributeName="d" begin="1.1s" dur="0.3s" values="M11 11L12 12L13 13L12 12z;M10.2 10.2L17 7L13.8 13.8L7 17z"></animate>
                            <animateTransform attributeName="transform" dur="9s" repeatCount="indefinite" type="rotate" values="-180 12 12;0 12 12;0 12 12;0 12 12;0 12 12;270 12 12;-90 12 12;0 12 12;-180 12 12;-35 12 12;-40 12 12;-45 12 12;-45 12 12;-110 12 12;-135 12 12;-180 12 12"></animateTransform>
                        </path>
                        <circle cx={12} cy={12} r={1} fill="#fff" fillOpacity={0} stroke="none">
                            <animate fill="freeze" attributeName="fill-opacity" begin="1.4s" dur="0.5s" values="0;1"></animate>
                        </circle>
                    </g>
                </mask>
                <rect width={24} height={24} fill="currentColor" mask="url(#SVGSL28tckf)"></rect>
            </svg> :
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
                <mask id="SVGuLqWuc9o">
                    <path fill="#fff" fillOpacity={0} stroke="#fff" strokeDasharray={56} strokeDashoffset={56} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19v0c-0.3 0 -0.59 -0.15 -0.74 -0.41c-0.8 -1.34 -1.26 -2.91 -1.26 -4.59c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 1.68 -0.46 3.25 -1.26 4.59c-0.15 0.26 -0.44 0.41 -0.74 0.41Z">
                        <animate fill="freeze" attributeName="fill-opacity" begin="0.3s" dur="0.15s" values="0;0.3"></animate>
                        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="56;0"></animate>
                    </path>
                    <g transform="rotate(-100 12 14)">
                        <path d="M12 14C12 14 12 14 12 14C12 14 12 14 12 14C12 14 12 14 12 14C12 14 12 14 12 14Z">
                            <animate fill="freeze" attributeName="d" begin="0.4s" dur="0.2s" values="M12 14C12 14 12 14 12 14C12 14 12 14 12 14C12 14 12 14 12 14C12 14 12 14 12 14Z;M16 14C16 16.21 14.21 18 12 18C9.79 18 8 16.21 8 14C8 11.79 12 0 12 0C12 0 16 11.79 16 14Z"></animate>
                        </path>
                        <path fill="#fff" d="M12 14C12 14 12 14 12 14C12 14 12 14 12 14C12 14 12 14 12 14C12 14 12 14 12 14Z">
                            <animate fill="freeze" attributeName="d" begin="0.4s" dur="0.2s" values="M12 14C12 14 12 14 12 14C12 14 12 14 12 14C12 14 12 14 12 14C12 14 12 14 12 14Z;M14 14C14 15.1 13.1 16 12 16C10.9 16 10 15.1 10 14C10 12.9 12 4 12 4C12 4 14 12.9 14 14Z"></animate>
                        </path>
                        <animateTransform attributeName="transform" begin="0.4s" dur="6s" repeatCount="indefinite" type="rotate" values="-100 12 14;45 12 14;45 12 14;45 12 14;20 12 14;10 12 14;0 12 14;35 12 14;45 12 14;55 12 14;50 12 14;15 12 14;-20 12 14;-100 12 14"></animateTransform>
                    </g>
                </mask>
                <rect width={24} height={24} fill="currentColor" mask="url(#SVGuLqWuc9o)"></rect>
            </svg>
}