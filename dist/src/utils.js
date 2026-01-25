export const formatDuration = (totalSeconds) => {
    if (totalSeconds < 60) {
        return `${totalSeconds} second${totalSeconds === 1 ? "" : "s"}`;
    }
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours === 0) {
        return `${minutes} minute${minutes === 1 ? "" : "s"}`;
    }
    return `${hours} hour${hours === 1 ? "" : "s"}`;
};
//# sourceMappingURL=utils.js.map