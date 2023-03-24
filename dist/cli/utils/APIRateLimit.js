export class APIRateLimit {
    constructor(maxConcurrentCalls = 50) {
        this.maxConcurrentCalls = maxConcurrentCalls;
        this.queue = [];
        this.inProgress = 0;
    }
    async callApi(apiFunction) {
        return new Promise((resolve, reject) => {
            const executeCall = async () => {
                this.inProgress++;
                try {
                    const result = await apiFunction();
                    resolve(result);
                }
                catch (error) {
                    reject(error);
                }
                finally {
                    this.inProgress--;
                    this.dequeueAndExecute();
                }
            };
            this.queue.push(executeCall);
            // Trigger the dequeue and execute operation when there are available slots for concurrent calls
            if (this.inProgress < this.maxConcurrentCalls) {
                this.dequeueAndExecute();
            }
        });
    }
    dequeueAndExecute() {
        while (this.queue.length > 0 && this.inProgress < this.maxConcurrentCalls) {
            const nextCall = this.queue.shift();
            if (nextCall) {
                nextCall();
            }
        }
    }
}
//# sourceMappingURL=APIRateLimit.js.map