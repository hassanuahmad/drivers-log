export function formatDuration(minutes: number) {
    const hours: number = Math.floor(minutes / 60);
    const remainingMinutes: number = minutes % 60;
    return `${hours}hr ${remainingMinutes}m`;
}