export class APIRateLimit {
  private queue: (() => void)[] = [];
  private inProgress = 0;

  constructor(private maxConcurrentCalls: number = 50) {}

  async callApi<T>(apiFunction: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const executeCall = async () => {
        this.inProgress++;
        try {
          const result = await apiFunction();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
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

  private dequeueAndExecute() {
    while (this.queue.length > 0 && this.inProgress < this.maxConcurrentCalls) {
      const nextCall = this.queue.shift();
      if (nextCall) {
        nextCall();
      }
    }
  }
}
