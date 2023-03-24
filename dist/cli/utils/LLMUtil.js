import { OpenAIChat } from 'langchain/llms';
import { LLMModels } from '../../types.js';
export const models = {
    [LLMModels.GPT3]: {
        name: LLMModels.GPT3,
        inputCostPer1KTokens: 0.002,
        outputCostPer1KTokens: 0.002,
        maxLength: 3050,
        llm: new OpenAIChat({
            temperature: 0.1,
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: LLMModels.GPT3,
        }),
        inputTokens: 0,
        outputTokens: 0,
        succeeded: 0,
        failed: 0,
        total: 0,
    },
    [LLMModels.GPT4]: {
        name: LLMModels.GPT4,
        inputCostPer1KTokens: 0.03,
        outputCostPer1KTokens: 0.06,
        maxLength: 8192,
        llm: new OpenAIChat({
            temperature: 0.1,
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: LLMModels.GPT4,
        }),
        inputTokens: 0,
        outputTokens: 0,
        succeeded: 0,
        failed: 0,
        total: 0,
    },
    [LLMModels.GPT432k]: {
        name: LLMModels.GPT432k,
        inputCostPer1KTokens: 0.06,
        outputCostPer1KTokens: 0.12,
        maxLength: 32768,
        llm: new OpenAIChat({
            temperature: 0.1,
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: LLMModels.GPT4,
        }),
        inputTokens: 0,
        outputTokens: 0,
        succeeded: 0,
        failed: 0,
        total: 0,
    },
};
export const printModelDetails = (models) => {
    const output = models.map((model) => {
        return {
            Model: model.name,
            'File Count': model.total,
            Succeeded: model.succeeded,
            Failed: model.failed,
            Tokens: model.inputTokens + model.outputTokens,
            Cost: (model.total / 1000) * model.inputCostPer1KTokens +
                (model.outputTokens / 1000) * model.outputCostPer1KTokens,
        };
    });
    const totals = output.reduce((cur, next) => {
        return {
            ...cur,
            'File Count': cur['File Count'] + next['File Count'],
            Succeeded: cur.Succeeded + next.Succeeded,
            Failed: cur.Failed + next.Failed,
            Tokens: cur.Tokens + next.Tokens,
            Cost: cur.Cost + next.Cost,
        };
    }, {
        Model: 'Total',
        'File Count': 0,
        Succeeded: 0,
        Failed: 0,
        Tokens: 0,
        Cost: 0,
    });
    const all = [...output, totals];
    console.table(all);
};
//# sourceMappingURL=LLMUtil.js.map