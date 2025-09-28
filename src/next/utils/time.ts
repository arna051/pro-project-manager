export function TimeDiff(s: number, e: number) {
    const ms = e - s;

    const sec = ms / 1e3;

    if (sec < 60) return `${Math.trunc(sec)} second(s)`;

    const min = sec / 60;

    if (min < 60) return `${min.toFixed(2)} minute(s)`;

    const hour = min / 60;

    if (hour < 24) return `${hour.toFixed(2)} hour(s)`;

    return `${(hour / 24).toFixed(2)} day(s)`
}