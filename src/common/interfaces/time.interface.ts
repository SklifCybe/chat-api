export interface Time {
    mode: 'seconds' | 'milliseconds';
    confirmTime: Record<Time['mode'], number>;
}
