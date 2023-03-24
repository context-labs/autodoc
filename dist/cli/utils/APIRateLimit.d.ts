export declare class APIRateLimit {
    private maxConcurrentCalls;
    private queue;
    private inProgress;
    constructor(maxConcurrentCalls?: number);
    callApi<T>(apiFunction: () => Promise<T>): Promise<T>;
    private dequeueAndExecute;
}
