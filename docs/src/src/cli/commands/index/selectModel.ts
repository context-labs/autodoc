import { encoding_for_model } from '@dqbd/tiktoken';
import { LLMModelDetails, LLMModels, Priority } from '../../../types.js';

export const selectModel = (
  prompts: string[],
  llms: LLMModels[],
  models: Record<LLMModels, LLMModelDetails>,
  priority: Priority,
): LLMModelDetails | null => {
  if (priority === Priority.COST) {
    if (
      llms.includes(LLMModels.GPT3) &&
      models[LLMModels.GPT3].maxLength >
        getMaxPromptLength(prompts, LLMModels.GPT3)
    ) {
      return models[LLMModels.GPT3];
    } else if (
      llms.includes(LLMModels.GPT4) &&
      models[LLMModels.GPT4].maxLength >
        getMaxPromptLength(prompts, LLMModels.GPT4)
    ) {
      return models[LLMModels.GPT4];
    } else if (
      llms.includes(LLMModels.GPT432k) &&
      models[LLMModels.GPT432k].maxLength >
        getMaxPromptLength(prompts, LLMModels.GPT432k)
    ) {
      return models[LLMModels.GPT432k];
    } else {
      return null;
    }
  } else {
    if (llms.includes(LLMModels.GPT4)) {
      if (
        models[LLMModels.GPT4].maxLength >
        getMaxPromptLength(prompts, LLMModels.GPT4)
      ) {
        return models[LLMModels.GPT4];
      } else if (
        llms.includes(LLMModels.GPT432k) &&
        models[LLMModels.GPT432k].maxLength >
          getMaxPromptLength(prompts, LLMModels.GPT432k)
      ) {
        return models[LLMModels.GPT432k];
      } else {
        return null;
      }
    } else {
      return models[LLMModels.GPT3];
    }
  }

  function getMaxPromptLength(prompts: string[], model: LLMModels) {
    const encoding = encoding_for_model(model);
    return Math.max(...prompts.map((p) => encoding.encode(p).length));
  }
};
