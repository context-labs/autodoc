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
    } else if (
      llms.includes(LLMModels.GPT4o) &&
      models[LLMModels.GPT4o].maxLength >
        getMaxPromptLength(prompts, LLMModels.GPT4o)
    ) {
      return models[LLMModels.GPT4o];
    } else if (
      llms.includes(LLMModels.GPT4omini) &&
      models[LLMModels.GPT4omini].maxLength >
        getMaxPromptLength(prompts, LLMModels.GPT4omini)
    ) {
      return models[LLMModels.GPT4omini];
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
      } else if (
        llms.includes(LLMModels.GPT4o) &&
        models[LLMModels.GPT4o].maxLength >
          getMaxPromptLength(prompts, LLMModels.GPT4o)
      ) {
        return models[LLMModels.GPT4o];
      } else if (
        llms.includes(LLMModels.GPT4omini) &&
        models[LLMModels.GPT4omini].maxLength >
          getMaxPromptLength(prompts, LLMModels.GPT4omini)
      ) {
        return models[LLMModels.GPT4omini];
      } else {
        return null;
      }
    } else {
      return models[LLMModels.GPT3];
    }
  }
  function convertToModel(model: LLMModels) {
    // convert gpt-4o-mini to GPT4o using encoding_for_model
    // Not in @dqbd/tiktoken model_to_encoding.json
    if (model == 'gpt-4o-mini') {
      return LLMModels.GPT4o;
    }
    return model
  }
  function getMaxPromptLength(prompts: string[], model: LLMModels) {
    const encoding = encoding_for_model(convertToModel(model));
    return Math.max(...prompts.map((p) => encoding.encode(p).length));
  }
};
