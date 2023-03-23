"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIRateLimit = void 0;
class APIRateLimit {
    constructor() {
        this.queue = [];
        this.inProgress = 0;
        this.maxConcurrentCalls = 50;
    }
    callApi(apiFunction) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const executeCall = () => __awaiter(this, void 0, void 0, function* () {
                    this.inProgress++;
                    try {
                        const result = yield apiFunction();
                        resolve(result);
                    }
                    catch (error) {
                        reject(error);
                    }
                    finally {
                        this.inProgress--;
                        this.dequeueAndExecute();
                    }
                });
                this.queue.push(executeCall);
                // Trigger the dequeue and execute operation when there are available slots for concurrent calls
                if (this.inProgress < this.maxConcurrentCalls) {
                    this.dequeueAndExecute();
                }
            });
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
exports.APIRateLimit = APIRateLimit;
//# sourceMappingURL=APIRateLimit.js.map